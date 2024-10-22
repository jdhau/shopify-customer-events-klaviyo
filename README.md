This is a Shopify Customer Events tracking project for both non-ecommerce and ecommerce events. 
It pushes events' data into the data layer, from where it can be retrieved using a tag manager system (e.g. Google Tag Manager) and sent to different vendors like Google Analytics, Google Ads, and others.

How to use:

1. 
Navigate to Online Store -> Themes -> Edit Code. 
Open the theme.liquid file. 
Put the contents of the '01 Shopify & GTM - theme dot liquid file.html' file as high in the <head> section as possible.

2. 
In the code editor, navigate to the 'snippets' section. 
Create a new snippet and name it 'gtm-customer-events-storefront'. 
Paste the contents of the '02 Shopify & GTM - gtm-customer-events-storefront dot liquid.html' file into the newly created snippet.

3. 
Navigate to your store's Settings -> Customer Events -> Add custom pixel. 
Name the pixel (e.g. 'GTM').
Paste the contents of the '03 Shopify & GTM - Customer Events.js' file into the newly created custom pixel.
Review the global settings in the beginning of the file, and be sure to insert your GTM container ID, and adjust any other settings as needed.

Events that can be tracked:
pageView

click

search

formSubmit

viewItemList

viewItem

addToCart

viewCart

removeFromCart

beginCheckout

addShippingInfo

addPaymentInfo

purchase
