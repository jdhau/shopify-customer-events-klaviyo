This is a Shopify Customer Events tracking project for both non-ecommerce and ecommerce events. 
It pushes events' data into the data layer, from where it can be retrieved using a tag manager system (e.g. Google Tag Manager) and sent to different vendors like Google Analytics, Google Ads, and others.

Using these scripts, you’ll be able to track the following events: page_view, view_item_list, view_item, add_to_cart, view_cart, remove_from_cart, begin_checkout, add_shipping_info, add_payment_info, purchase, view_search_results, form_submit, clicks (in general) 

How to use:

It contains three scripts: gtm-customer-events-storefront, theme, and custom-pixel.

1. gtm-customer-events-storefront
Navigate to Online Store > Themes > Edit Code, and locate the 'snippets' section. Create a new snippet and name it 'gtm-customer-events-storefront' (without quotes). Paste the contents of the 'gtm-customer-events-storefront' script into the newly created snippet.

2. theme
With the code editor still open, locate the theme.liquid file. Paste the contents of the 'theme' script as high in the <head> section as possible.

3. custom-pixel
Navigate to your store's Settings > Customer Events > Add custom pixel.
Name the pixel (e.g. 'GTM pixel') and open it.
In the Customer Privacy section, select:
- Not required (in the Permission section) 
- Data collection does not qualify as data sale (in the Data sale section)
Then, scroll down to the Code section and replace the placeholder code by Shopify with the contents of the 'custom pixel' script.
Review and adjust the global settings at the top of the script.