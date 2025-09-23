# Made by MeesaJarJar - http://github.com/MeesaJarJar/  -------#
# BabyBro / MeesaJarJar on Discord - Peace & Love! -------------#
# -------------------------------------------------------------#
# Description: Save Individual Item Images with a background
# -------------------------------------------------------------#
# START CONFIG ------------------------------------------------#
OUTPUT_FOLDER = "C:\\UOITEMS\\" # Path to where you will save the output images
SAVE_HUE_IN_NAME = False # Whether or not you want to include the hue in the image name
BACKGROUND_IMAGE_PATH = "C:\\UOITEMS\\container.png"  # Path to the background image

# API CONFIG --------------------------------------------------#
API_URL = "https://www.uoking.com/api/products/create"  # Replace with your actual domain
UPLOAD_TO_API = True  # Set to False if you just want to save locally
DEFAULT_PRICE = "10.00"  # Default price for items (you can modify this)
# END CONFIG --------------------------------------------------#

import re
import clr
import base64
import json
from System.IO import MemoryStream
from System.Net import WebClient
from System.Text import Encoding

clr.AddReference("System.Drawing")
from System.Drawing import Image, Bitmap
from System.Drawing import Graphics, Imaging

def get_item_properties_description(item):
    """Extract all item properties and format with line breaks"""
    try:
        # Wait for properties to load
        Items.WaitForProps(item, 1000)
        
        # Get all properties from the item using GetPropStringList
        properties = []
        basic_properties = []
        
        # Add basic item info first
        if hasattr(item, 'ItemID'):
            basic_properties.append(f"Item ID: {item.ItemID}")
        if hasattr(item, 'Hue') and item.Hue > 0:
            basic_properties.append(f"Hue: {item.Hue}")
        if hasattr(item, 'Amount') and item.Amount > 1:
            basic_properties.append(f"Quantity: {item.Amount}")
        
        # Get all property strings from the item
        prop_strings = Items.GetPropStringList(item)
        
        # Show what properties were found
        if prop_strings:
            print(f"📋 Found {len(prop_strings)} properties:")
            for i, prop in enumerate(prop_strings):
                print(f"   {i+1}. {prop}")
        else:
            print("📋 No properties found on this item")
        
        # Properties to skip (we don't want these in the description)
        skip_properties = [
            'weight',  # Usually not important for display
            'contents',  # Container info
            'owner',  # Player ownership info
        ]
        
        # Process each property string (skip index 0 as it's the item name)
        if prop_strings:
            for i, prop in enumerate(prop_strings):
                # Skip property 0 (item name)
                if i == 0:
                    continue
                    
                if not prop or prop.strip() == "":
                    continue
                    
                # Convert to lowercase for easier checking
                prop_lower = prop.lower()
                
                # Skip properties we don't want
                should_skip = False
                for skip_prop in skip_properties:
                    if skip_prop in prop_lower:
                        should_skip = True
                        break
                
                if should_skip:
                    continue
                
                # Clean up the property string and format it
                clean_prop = prop.strip()
                
                # Remove HTML tags but preserve the content
                import re
                clean_prop = re.sub(r'<[^>]+>', '', clean_prop)
                
                # Skip empty properties after cleaning
                if not clean_prop or clean_prop.strip() == "":
                    continue
                
                # Capitalize first letter of each word for all properties
                formatted_prop = clean_prop.title()
                properties.append(formatted_prop)
        
        # Combine all properties
        all_properties = basic_properties + properties
        
        if all_properties:
            return '\r\n'.join(all_properties)
        else:
            return f"UO Item: {item.Name}"
            
    except Exception as e:
        print(f"⚠️  Error getting properties: {str(e)}")
        return f"UO Item: {item.Name}"

def upload_to_api(image_path, item_name, item_description, price):
    """Upload the item to your API"""
    try:
        # Read and convert image to base64
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            image_base64 = f"data:image/png;base64,{image_base64}"
        
        # Prepare payload
        payload = {
            'name': item_name,
            'description': item_description,
            'price': price,
            'image_base64': image_base64
        }
        
        # Convert payload to JSON
        json_payload = json.dumps(payload)
        
        # Create WebClient and set headers
        client = WebClient()
        client.Headers.Add("Content-Type", "application/json")
        
        # Make the request
        response = client.UploadString(API_URL, "POST", json_payload)
        
        # Parse response
        if not response or response.strip() == "":
            print(f"❌ Empty response from server")
            return False
            
        response_data = json.loads(response)
        
        if response_data.get('success'):
            print(f"✅ Successfully uploaded to API! Product ID: {response_data['product']['id']}")
            print(f"🔗 Image URL: {response_data['product']['image_url']}")
            return True
        else:
            print(f"❌ API Error: {response_data.get('error', 'Unknown error')}")
            return False
            
    except ValueError as e:
        print(f"❌ JSON Parse Error - Server returned: '{response[:100]}...'")
        return False
    except Exception as e:
        print(f"❌ Upload failed: {str(e)}")
        return False
    finally:
        if 'client' in locals():
            client.Dispose()

keepGoing = True
while keepGoing == True:
    target_serial = Target.PromptTarget(f"Select Item to Save Image of (press ESC to stop adding)")

    item = Items.FindBySerial(target_serial)
    if item:
        # Get the item's image
        item_image = Items.GetImage(item.ItemID, item.Hue)
        name = item.Name
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
        clean_name = re.sub(r'\s+', '_', clean_name)

        if SAVE_HUE_IN_NAME:
            output_filename = f"{OUTPUT_FOLDER}{str(clean_name)}_{str(item.Hue).strip()}.png".lower()
            display_name = f"{name} (Hue {item.Hue})"
        else:
            output_filename = f"{OUTPUT_FOLDER}{str(clean_name)}.png".lower()
            display_name = name

        # Load the background image
        background_image = Image.FromFile(BACKGROUND_IMAGE_PATH)
        background_width = background_image.Width
        background_height = background_image.Height

        # Create a new bitmap to compose the final image
        final_image = Bitmap(background_width, background_height)
        graphics = Graphics.FromImage(final_image)

        # Draw the background image first
        graphics.DrawImage(background_image, 0, 0, background_width, background_height)

        # Calculate the position to center the item image and adjust the Y by 20%
        item_width = item_image.Width
        item_height = item_image.Height
        x = (background_width - item_width) // 2
        y = int((background_height - item_height) // 2 + (background_height * 0.2))  # Lower by 20%

        # Draw the item image over the background
        graphics.DrawImage(item_image, x, y, item_width, item_height)

        # Save the final image
        print(f"💾 Saving to {output_filename}")
        final_image.Save(output_filename, Imaging.ImageFormat.Png)

        # Upload to API if enabled
        if UPLOAD_TO_API:
            print(f"🚀 Uploading {display_name} to API...")
            
            # Create description with all item properties
            print(f"📋 Extracting item properties...")
            description = get_item_properties_description(item)
            
            # Upload to API
            upload_success = upload_to_api(output_filename, display_name, description, DEFAULT_PRICE)
            
            if upload_success:
                print(f"✨ {display_name} successfully added to your store!")
            else:
                print(f"⚠️  {display_name} saved locally but failed to upload to API")
        
        print("-" * 50)

        # Cleanup resources
        graphics.Dispose()
        background_image.Dispose()
        final_image.Dispose()

    if not target_serial or target_serial == -1:
        Misc.SendMessage("Target selection interrupted or invalid target selected.")
        keepGoing = False

print("🎉 Script completed!")
