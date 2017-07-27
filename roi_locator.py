import sys
import numpy as np
import nibabel as nib

def find_roi_center():
    if len(sys.argv) < 3:
        print("there is no roi or directory command line argument")
        return

    roi = int(sys.argv[1])
    roi_coords = []

    directory = sys.argv[2]

    i = 0
    for x in nib.load('{0}/public/NiftiFiles/converted.nii'.format(directory)).get_data():
        j = 0
        for y in x:
            k = 0
            for z in y:
                if z[0] == roi:
                    roi_coords.append((i, j ,k))
                k += 1
            j += 1
        i += 1
    
    center = [np.mean([coord[i] for coord in roi_coords]) for i in range(3)]
    center = list(map(int, center))
    print(center)

find_roi_center()
