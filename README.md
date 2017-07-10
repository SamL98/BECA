# BECA

The BECA application allows users to analyze the effect of multiple Single Nucleotide Polymorphisms (SNP's). This information is visualized in three ways: 

* SNP Chart - SNP's are displayed on a scatter plot with x-position corresponding to their position on the given chromosome and y-position corresponding to their -log(p) where p is the p-value of the SNP according to the given Region of Interest (ROI). Annotations for each SNP are provided displaying its name, location, and p-value.
* Voxel Grid - SNP's are displayed in a 2-D grid where columns represent an entire SNP and rows represent an ROI on all SNP's. The color of a cell in row i and column j is the p-value of SNP i on ROI j interpolated into HSV colorspace.
* Brain Renderer - The axial, sagittal, and coronal slices of the brain are displayed. If a SNP (column) is selected in the Voxel Grid, the heatmap (HSV-interpolated p-values) for that SNP is displayed on the slices, mapping ROI's.

## Usage

After the window finishes loading, enter a query and an ROI in the control panel in the top-left corner. The given ROI must be an integer from 1 to 116. The query can be formatted in three ways:

* Gene - Input a gene name, and the SNP's within the start and end basepair location of that gene (with a 200k basepair buffer on both sides) will be displayed.
* SNP - Input a SNP name, and the SNP's within the basepair location, given a 300k basepair buffer on both sides will be displayed.
* Range - Input a chromosome and start and end basepair locations. This information should be formatted as:

    (chromosome_number):(lower_bound)-(upper_bound)

    or if you know RegEx, your query should match the expression:


    /\d{1,2}\:\d+\-\d+/