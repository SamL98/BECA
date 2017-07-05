import colorsys
import csv
import ast
import sys

def interpolate_color(val):
    h_val = 240.0 * val
    r, g, b = colorsys.hsv_to_rgb(h_val/360.0, 1.0, 1.0)
    return int(r * 255), int(g * 255), int(b * 255)

def create_colortable():
    print("creating colortable")
    if len(sys.argv) < 2:
        print("there is no snp command line argument")
        return

    csv_reader = csv.reader(open("ROIid.csv"))
    rois = [r for r in csv_reader]

    snp = ast.literal_eval(sys.argv[1])
    if not isinstance(snp, dict):
        print("snp is not a dict")
        return

    with open("public/snp_colortable.txt", "w+") as f:
        f.write("0 background 0 0 0 0\n")
        snp.pop('name', None)
        snp.pop('loc', None)

        i = 0
        for (key, value) in snp.items():
            roi_name = (rois[i + 1])[0]
            p = float(value)
            r, g, b = interpolate_color(p)
            f.write("{0}, {1}, {2}, {3}, {4} 255\n".format(roi_name, r, g, b, i + 1))

create_colortable()