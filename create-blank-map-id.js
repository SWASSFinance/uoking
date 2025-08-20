console.log('Setting up blank Map ID for UOKing maps...');

console.log(`
To create a blank Map ID for Advanced Markers:

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Navigate to "APIs & Services" > "Maps Platform" > "Map Management"
3. Click "Create Map ID"
4. Name: "uoking_blank_map"
5. Map Type: "Vector"
6. Styling: "Custom"
7. In the styling editor, add these rules to make it completely blank:

   - Feature Type: "All", Element Type: "All" → Visibility: "Off"
   - Feature Type: "Administrative", Element Type: "All" → Visibility: "Off"
   - Feature Type: "Landscape", Element Type: "All" → Visibility: "Off"
   - Feature Type: "POI", Element Type: "All" → Visibility: "Off"
   - Feature Type: "Road", Element Type: "All" → Visibility: "Off"
   - Feature Type: "Transit", Element Type: "All" → Visibility: "Off"
   - Feature Type: "Water", Element Type: "All" → Visibility: "Off"
   - Feature Type: "All", Element Type: "Geometry" → Background Color: "#e6f3ff"

8. Save the Map ID
9. Copy the Map ID and update the code to use it

The Map ID will look something like: "1234567890abcdef"

Once you have the Map ID, replace 'uoking_blank_map' in the code with your actual Map ID.
`);
