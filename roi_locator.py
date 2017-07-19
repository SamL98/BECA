import sys
import numpy as np
import nibabel as nib

def find_roi_center():
    if len(sys.argv) < 2:
        print("there is no roi command line argument")
        return

    roi = int(sys.argv[1])
    roi_coords = []

    i = 0
    for x in nib.load('public/niftifiles/converted.nii').get_data():
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
    return list(map(int, center))

find_roi_center()
