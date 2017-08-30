port module Main exposing (Model, Msg, update, view, subscriptions, init)


import Html exposing (..)
import Html.Attributes
import Svg
import Svg.Attributes
import Json.Decode exposing (..)
import List
import Dict exposing (get)
import Debug exposing (log)
import String exposing (toInt)
import Platform.Sub exposing (batch)


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
    }

type alias Paper = Int

type alias Association =
    { cohort : String
    , trait : String
    , population : Int
    , pvalue : Float
    }

type alias Snp =
    { name : String
    , chr : Int
    , pos : Int
    , paper : Paper
    , assoc : Association
    , x : Float
    , y : Float
    }
type alias Bounds =
    { low : Int
    , high: Int
    }

type alias Model = 
    { snps : List Snp
    , bounds : Bounds
    }


type Msg
    = Display
    | Detail String
    | UpdateSnps String
    | UpdateBounds String


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        Display ->
            (model, Cmd.none)

        Detail snp ->
            (model, Cmd.none)

        UpdateBounds boundStr ->
            ({model | bounds = decodeBounds boundStr }, Cmd.none)

        UpdateSnps snpStr ->
            ({model | snps = decodeSnps snpStr model.bounds}, Cmd.none)

decodeBounds : String -> Bounds
decodeBounds str =
    case decodeString (dict int) str of
        Ok res ->
            case ((get "low" res), (get "high" res)) of
                (Just low, Just high) ->
                    Bounds low high
                _ ->
                    Bounds 0 0
        Err _ ->
            Bounds 0 0

decodeSnps : String -> Bounds -> List Snp
decodeSnps str bounds =
    case decodeString (list (dict string)) (Debug.log "snp" str) of
        Ok res ->
            List.filterMap (decodeSnp bounds) res
        Err _ ->
            []

decodeSnp : Bounds -> Dict.Dict String String -> Maybe Snp
decodeSnp bounds snpDict =
    let
        name = get "name" snpDict
        pos = getAndConvertInt snpDict "pos"
        chr = getAndConvertInt snpDict "chr"
        trait = get "trait" snpDict
        pop = getAndConvertInt snpDict "size"
        cohort = get "cohort" snpDict
        pval = getAndConvertFloat snpDict "pvalue"
        paper = getAndConvertInt snpDict "pubmed"
    in
        case ((Debug.log "name" name), (Debug.log "pos" pos), chr, trait, pop, cohort, pval, paper) of
            (Just n, Just po, Just ch, Just t, Just pop, Just coh, Just pv, Just pap) ->
                Just (Snp n ch po pap (Association coh t pop pv) 
                    ((toFloat (chartWidth*po))/(toFloat (bounds.high-bounds.low)))
                    ((toFloat chartHeight)*(-(logBase 10 pv))))
            _ ->
                Nothing

getAndConvertInt : Dict.Dict String String -> String -> Maybe Int
getAndConvertInt dictionary key =
    case get key dictionary of
        Just val ->
            case String.toInt val of
                Ok returnVal ->
                    Just returnVal
                Err _ ->
                    Nothing
        Nothing ->
            Nothing

getAndConvertFloat : Dict.Dict String String -> String -> Maybe Float
getAndConvertFloat dictionary key =
    case get key dictionary of
        Just val ->
            case String.toFloat val of
                Ok returnVal ->
                    Just returnVal
                Err _ ->
                    Nothing
        Nothing ->
            Nothing


chartWidth : Int
chartWidth = 500
chartHeight : Int
chartHeight = 350

view : Model -> Html Msg
view model =
    Svg.rect [ Html.Attributes.id "chart"
    , Svg.Attributes.width (toString chartWidth)
    , Svg.Attributes.height (toString chartHeight) ] 
    (List.map (viewForSnp model.bounds) model.snps)

viewForSnp : Bounds -> Snp -> Svg.Svg msg
viewForSnp bounds snp =
    Svg.circle 
        [ Svg.Attributes.cx (toString (Debug.log "x" snp.x))
        , Svg.Attributes.cy (toString (Debug.log "y" snp.y))
        , Svg.Attributes.stroke "black"
        , Svg.Attributes.fill "steelblue"
        ] []


port query : (String -> msg) -> Sub msg
port bounds : (String -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
    batch 
        [ query UpdateSnps
        , bounds UpdateBounds
        ]


init : (Model, Cmd Msg)
init = 
    (Model [] (Bounds 0 0), Cmd.none)
