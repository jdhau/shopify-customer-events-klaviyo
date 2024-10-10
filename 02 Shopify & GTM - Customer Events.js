/* *********************************************************************************
****************************** GLOBAL SETTINGS *************************************
make sure to go through the settings below and change the values where applicable
********************************************************************************** */
const config = {
    /* *************** CONVERSION TRACKING SETTINGS *************** */
    conversionTracking: {
        gtmContainerId: 'GTM-XXXXXX', // replace with your Google Tag Manager container ID
        // change to false for events that you don't want to be pushed to the data layer:
        trackPageViews: true,
        trackClicks: true,
        trackSearch: true,
        trackFormSubmit: true,
        trackViewItemList: true,
        trackViewItem: true,
        trackAddToCart: true,
        trackViewCart: true,
        trackRemoveFromCart: true,
        trackBeginCheckout: true,
        trackAddShippingInfo: true,
        trackAddPaymentInfo: true,
        trackPurchase: true,
    },

    /* *************** STORE SETTINGS *************** */
    store: {
        affiliationName: 'XXXXXX', // replace with e.g. your store name
    },  

}
/* *********************************************************************************
****************************** END OF GLOBAL SETTINGS ******************************
********************************************************************************** */

//Store the clean page URL (and other things) in the dataLayer before GTM loads
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  page_location : init.context.document?.location?.href,
  page_referrer : init.context.document?.referrer,
  page_title : init.context.document?.title,
});


  // Insert GTM script
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', config.conversionTracking.gtmContainerId);
}



/* *******************************************************************************
****************************** NON-ECOMMERCE EVENTS ******************************
********************************************************************************** */
const pageLocationInit = init.context?.document?.location?.href;

/* *************** PAGE VIEW TRACKING *************** */
if (config.conversionTracking.trackPageViews) {
    analytics.subscribe("page_viewed", (event) => {
        window.dataLayer.push({
            'event': 'page_view',
            'page_location': event.context?.document?.location?.href,
            'page_referrer': event.context?.document?.referrer,
            'page_title': event.context?.document?.title,
        });
    });
}
/* *************** END OF PAGE VIEW TRACKING *************** */

if (config.conversionTracking.trackClicks) {
    /* *************** CLICK TRACKING - storefront *************** */
    analytics.subscribe("custom_click", (event) => {
        window.dataLayer.push({
            'event': 'custom_click_storefront',
            'data': event.customData,
            'page_location': pageLocationInit,
        });
    });
      
    analytics.subscribe("custom_link_click", (event) => {
        window.dataLayer.push({
            'event': 'custom_click_link_storefront',
            'data': event.customData,
            'page_location': pageLocationInit,
        });
    });
    /* *************** END OF CLICK TRACKING - storefront *************** */
      
    /* *************** CLICK TRACKING - checkout *************** */
    if (init.context?.document?.location?.href.includes('/checkouts/')) {
        analytics.subscribe('clicked', (event) => {
        const element = event.data?.element;
        
        // construct the data layer object:
        const dataLayerObj = {
            event: "custom_click_checkout",
            data: {
                click_element : element?.type || '',
                click_id : element?.id || '',
                click_classes : '',
                click_text : element?.value || '',
                click_target : '',
                click_url : element?.href || '',
                page_location: pageLocationInit
            }
        }
        
        window.dataLayer.push(dataLayerObj);
        
        });
    }
    /* *************** END OF CLICK TRACKING - checkout *************** */
}
  
/* *************** SEARCH *************** */
if (config.conversionTracking.trackSearch) {
    analytics.subscribe('search_submitted', (event) => {
        window.dataLayer.push({
            event: 'view_search_results',
            page_location: event.context?.window?.location?.href,
            page_title: event.context.document.title,
            search_term: event.data.searchResult.query,
            first_product: event.data.searchResult.productVariants[0]?.product.title
        });
    });  
}
/* *************** END OF SEARCH *************** */

/* *************** FORM SUBMIT *************** */
if (config.conversionTracking.trackFormSubmit) {
    analytics.subscribe('form_submitted', (event) => {
        window.dataLayer.push({
            event: 'form_submit',
            page_location: pageLocationInit,
            form_action: event.data?.element?.action,
            form_id: event.data?.element?.id,
        });
    });  
}
/* *************** END OF FORM SUBMIT *************** */


/* *******************************************************************************
****************************** ECOMMERCE EVENTS **********************************
********************************************************************************** */

/* *************** VIEW ITEM LIST *************** */
if (config.conversionTracking.trackViewItemList) {
    analytics.subscribe("collection_viewed", (event) => { 
    
        const collection = event.data?.collection;
        var googleAnalyticsProducts = [];
    
        // loop through the products:
        collection?.productVariants?.forEach(function(item, index) {
            // GA4
            var productVariant = {
                item_id: item.product?.id,
                item_name: item.product?.title,
                affiliation: config.store.affiliationName,
                index: index,
                item_brand: item.product?.vendor,
                item_category: item.product?.type,
                item_list_id: collection?.id,
                item_list_name: collection?.title,
                price: item.price?.amount,
                quantity: 1
            };
            googleAnalyticsProducts.push(productVariant);     
        });
    
        // construct the data layer object:
        const dataLayerObj = {
            event: "view_item_list",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                item_list_id: collection?.id,
                item_list_name: collection?.title,
                items: googleAnalyticsProducts
            }
        }
    
        // push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF VIEW ITEM LIST *************** */

/* *************** VIEW ITEM *************** */
if (config.conversionTracking.trackViewItem) {
    analytics.subscribe("product_viewed", (event) => { 
    
        const productVariant = event.data?.productVariant;
        var googleAnalyticsProducts = [];

        // GA4 - get the product info
        var productInfo = {
            item_id: productVariant?.product?.id,
            item_name: productVariant?.product?.title,
            affiliation: config.store.affiliationName,
            index: 0,
            item_brand: productVariant?.product?.vendor,
            item_category: productVariant?.product?.type,
            item_variant: productVariant?.title,
            price: productVariant?.price?.amount,
            quantity: 1
        };    
        googleAnalyticsProducts.push(productInfo); 
        
        // construct the data layer object:
        const dataLayerObj = {
            event: "view_item",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                currency: productVariant?.price?.currencyCode,
                value: productVariant?.price?.amount, 
                items: googleAnalyticsProducts
            }
        }
    
        // push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF VIEW ITEM *************** */


/* *************** ADD TO CART *************** */
if (config.conversionTracking.trackAddToCart) {
    analytics.subscribe('product_added_to_cart', (event) => {
        
        const cartLine = event.data?.cartLine;
        var googleAnalyticsProducts = [];

        // GA4 - get the product info
        var productInfo = {
            item_id: cartLine?.merchandise?.product?.id,
            item_name: cartLine?.merchandise?.product?.title,
            affiliation: config.store.affiliationName,
            index: 0,
            item_brand: cartLine?.merchandise?.product?.vendor,
            item_category: cartLine?.merchandise?.product?.type,
            item_variant: cartLine?.merchandise?.title,
            price: cartLine?.merchandise?.price?.amount,
            quantity: cartLine?.quantity
        };    
        googleAnalyticsProducts.push(productInfo); 
    
        // construct the data layer object:
        const dataLayerObj = {
            event: "add_to_cart",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                currency: cartLine?.cost?.totalAmount?.currencyCode,
                value: cartLine?.cost?.totalAmount?.amount, 
                items: googleAnalyticsProducts
            }
        }   

        // push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF ADD TO CART *************** */


/* *************** VIEW CART *************** */
if (config.conversionTracking.trackViewCart) {
    analytics.subscribe('cart_viewed', (event) => {

    const cart = event.data?.cart;
    var googleAnalyticsProducts = [];

    // loop through the products:
    cart?.lines?.forEach(function(item, index) {
        // GA4
        var lineItem = {
            item_id: item.merchandise?.product?.id,
            item_name: item.merchandise?.product?.title,
            affiliation: config.store.affiliationName,
            index: index,
            item_brand: item.merchandise?.product?.vendor,
            item_category: item.merchandise?.product?.type,
            item_variant: item.merchandise?.title,
            price: item.merchandise?.price?.amount,
            quantity: item.quantity
        };
        googleAnalyticsProducts.push(lineItem);
    });
    
    // construct the data layer object:
    const dataLayerObj = {
        event: "view_cart",
        page_location: event.context?.document?.location?.href,
        ecommerce: {
            currency: cart?.cost?.totalAmount?.currencyCode,
            value: cart?.cost?.totalAmount?.amount, 
            items: googleAnalyticsProducts
        }
    }   

    // push the content to the dataLayer:
    window.dataLayer.push({ 'ecommerce': null });
    window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF VIEW CART *************** */


/* *************** REMOVE FROM CART *************** */
if (config.conversionTracking.trackRemoveFromCart) {
    analytics.subscribe('product_removed_from_cart', (event) => {
    
        const cartLine = event.data?.cartLine;
        var googleAnalyticsProducts = [];

        // GA4 - get the product info
        var productInfo = {
            item_id: cartLine?.merchandise?.product?.id,
            item_name: cartLine?.merchandise?.product?.title,
            affiliation: config.store.affiliationName,
            index: 0,
            item_brand: cartLine?.merchandise?.product?.vendor,
            item_category: cartLine?.merchandise?.product?.type,
            item_variant: cartLine?.merchandise?.title,
            price: cartLine?.merchandise?.price?.amount,
            quantity: cartLine?.quantity
        };    
        googleAnalyticsProducts.push(productInfo); 
        
        // construct the data layer object:
        const dataLayerObj = {
            event: "remove_from_cart",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                currency: cartLine?.cost?.totalAmount?.currencyCode,
                value: cartLine?.cost?.totalAmount?.amount, 
                items: googleAnalyticsProducts
            }
        }

        // push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF REMOVE FROM CART *************** */


/* *************** BEGIN CHECKOUT *************** */
if (config.conversionTracking.trackBeginCheckout) {
    analytics.subscribe("checkout_started", (event) => {

        const checkout = event.data?.checkout;
        var googleAnalyticsProducts = [];

        // discount:
        const allDiscountCodes = checkout?.discountApplications?.map((discount) => {
            if (discount.type === 'DISCOUNT_CODE') {
                return discount.title;
            }
        });

        // loop through the products:
        checkout?.lineItems?.forEach(function(item, index) {
            // GA4
            var lineItem = {
                item_id: item.variant?.product?.id,
                item_name: item.variant?.product?.title,
                affiliation: config.store.affiliationName,
                coupon: allDiscountCodes || '',
                index: index,
                item_brand: item.variant?.product?.vendor,
                item_category: item.variant?.product?.type,
                item_variant: item.variant?.title,
                price: item.variant?.price?.amount,
                quantity: item.quantity
            };
            googleAnalyticsProducts.push(lineItem); 
        });

        // construct the data layer object:
        const dataLayerObj = {
            event: "begin_checkout",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                currency: checkout?.currencyCode,
                value: checkout?.subtotalPrice?.amount,
                coupon: allDiscountCodes || '',
                items: googleAnalyticsProducts
            }
        }

        // push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF BEGIN CHECKOUT *************** */


/* *************** ADD SHIPPING INFO *************** */
if (config.conversionTracking.trackAddShippingInfo) {
    analytics.subscribe("checkout_shipping_info_submitted", (event) => {

        const checkout = event.data?.checkout;
        var googleAnalyticsProducts = [];

        /* *************** START DISCOUNT CALCULATIONS *************** */
        let orderCoupon = []; // to hold the discount titles
        let orderDiscountAmount = checkout.discountsAmount?.amount || 0;
        let totalOrderValue = checkout.totalPrice?.amount || 0;

        // Handle item-specific discounts
        checkout?.lineItems?.forEach((item, index) => {
            let itemDiscountAmount = 0;

            // Process discounts for this item
            item.discountAllocations?.forEach((allocation, allocationIndex) => {
                const discount = allocation.discountApplication;

                // Capture the discount title if not already added
                if (discount.title && !orderCoupon.includes(discount.title)) {
                    orderCoupon.push(discount.title);
                }

                // Accumulate discount amount for the item
                const allocationAmount = allocation.amount.amount;
                itemDiscountAmount += allocationAmount;
            });

            // GA4: Calculate price after discount
            const itemPrice = item.variant.price.amount;
            const priceAfterDiscount = itemPrice - (itemDiscountAmount / item.quantity);

        /* *************** END DISCOUNT CALCULATIONS *************** */
          
            // GA4
            var lineItem = {
                item_id: item.variant?.product?.id,
                item_name: item.variant?.product?.title,
                affiliation: config.store.affiliationName,
                coupon: orderCoupon.join(','),
                discount: itemDiscountAmount / item.quantity, 
                index: index,
                item_brand: item.variant?.product?.vendor,
                item_category: item.variant?.product?.type,
                item_variant: item.variant?.title,
                price: priceAfterDiscount,
                quantity: item.quantity
            };
            googleAnalyticsProducts.push(lineItem); 

        });

        // Join the discount codes for the orderCoupon
        var orderCouponString = orderCoupon.join(',');

        // construct the data layer object:
        const dataLayerObj = {
            event: "add_shipping_info",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                currency: checkout?.currencyCode,
                value: (totalOrderValue || 0).toFixed(2),
                coupon: orderCouponString,
                discount: (orderDiscountAmount || 0).toFixed(2),
                items: googleAnalyticsProducts
            }
        }

        // push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF ADD SHIPPING INFO *************** */


/* *************** ADD PAYMENT INFO *************** */
if (config.conversionTracking.trackAddPaymentInfo) {
    analytics.subscribe("payment_info_submitted", (event) => {

        const checkout = event.data?.checkout;
        var googleAnalyticsProducts = [];

        /* *************** START DISCOUNT CALCULATIONS *************** */
        let orderCoupon = []; // to hold the discount titles
        let orderDiscountAmount = checkout.discountsAmount?.amount || 0;
        let totalOrderValue = checkout.totalPrice?.amount || 0;

        // Handle item-specific discounts
        checkout?.lineItems?.forEach((item, index) => {
            let itemDiscountAmount = 0;

            // Process discounts for this item
            item.discountAllocations?.forEach((allocation, allocationIndex) => {
                const discount = allocation.discountApplication;

                // Capture the discount title if not already added
                if (discount.title && !orderCoupon.includes(discount.title)) {
                    orderCoupon.push(discount.title);
                }

                // Accumulate discount amount for the item
                const allocationAmount = allocation.amount.amount;
                itemDiscountAmount += allocationAmount;
            });

            // GA4: Calculate price after discount
            const itemPrice = item.variant.price.amount;
            const priceAfterDiscount = itemPrice - (itemDiscountAmount / item.quantity);

        /* *************** END DISCOUNT CALCULATIONS *************** */
          
            // GA4
            var lineItem = {
                item_id: item.variant?.product?.id,
                item_name: item.variant?.product?.title,
                affiliation: config.store.affiliationName,
                coupon: orderCoupon.join(','),
                discount: itemDiscountAmount / item.quantity,
                index: index,
                item_brand: item.variant?.product?.vendor,
                item_category: item.variant?.product?.type,
                item_variant: item.variant?.title,
                price: priceAfterDiscount,
                quantity: item.quantity
            };
            googleAnalyticsProducts.push(lineItem); 

        });

        // Join the discount codes for the orderCoupon
        var orderCouponString = orderCoupon.join(',');   

        // construct the data layer object:
        const dataLayerObj = {
            event: "add_payment_info",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                currency: checkout?.currencyCode,
                value: (totalOrderValue || 0).toFixed(2),
                coupon: orderCouponString,
                discount: (orderDiscountAmount || 0).toFixed(2),
                items: googleAnalyticsProducts
            }
        }

        // push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF ADD PAYMENT INFO *************** */


/* *************** PURCHASE *************** */
if (config.conversionTracking.trackPurchase) {
    analytics.subscribe("checkout_completed", (event) => {

        const checkout = event.data?.checkout;
        var googleAnalyticsProducts = [];

        /* *************** START DISCOUNT CALCULATIONS *************** */
        let orderCoupon = []; // to hold the discount titles
        let orderDiscountAmount = checkout.discountsAmount?.amount || 0;
        let totalOrderValue = checkout.totalPrice?.amount || 0;

        // Handle item-specific discounts
        checkout?.lineItems?.forEach((item, index) => {
            let itemDiscountAmount = 0;

            // Process discounts for this item
            item.discountAllocations?.forEach((allocation, allocationIndex) => {
                const discount = allocation.discountApplication;

                // Capture the discount title if not already added
                if (discount.title && !orderCoupon.includes(discount.title)) {
                    orderCoupon.push(discount.title);
                }

                // Accumulate discount amount for the item
                const allocationAmount = allocation.amount.amount;
                itemDiscountAmount += allocationAmount;
            });

            // GA4: Calculate price after discount
            const itemPrice = item.variant.price.amount;
            const priceAfterDiscount = itemPrice - (itemDiscountAmount / item.quantity);

      /* *************** END DISCOUNT CALCULATIONS *************** */
          
            // GA4
            var lineItem = {
                item_id: item.variant?.product?.id,
                item_name: item.variant?.product?.title,
                affiliation: config.store.affiliationName,
                coupon: orderCoupon.join(','),
                discount: itemDiscountAmount / item.quantity,
                index: index,
                item_brand: item.variant?.product?.vendor,
                item_category: item.variant?.product?.type,
                item_variant: item.variant?.title,
                price: priceAfterDiscount,
                quantity: item.quantity
            };
            googleAnalyticsProducts.push(lineItem); 

        });

        // Join the discount codes for the orderCoupon
        var orderCouponString = orderCoupon.join(',');

        // Determine the payment type
        const paymentType = checkout?.transactions?.[0]?.gateway || 'no payment type';

        // Construct the data layer object
        const dataLayerObj = {
            event: "purchase",
            page_location: event.context?.document?.location?.href,
            ecommerce: {
                transaction_id: checkout?.order?.id,
                currency: checkout?.currencyCode,
                value: (totalOrderValue || 0).toFixed(2),
                tax: (checkout?.totalTax?.amount || 0).toFixed(2),
                shipping: (checkout?.shippingLine?.price?.amount || 0).toFixed(2),
                coupon: orderCouponString,
                discount: (orderDiscountAmount || 0).toFixed(2),
                payment_type: paymentType,
                items: googleAnalyticsProducts
            }
        };

        // Push the content to the dataLayer:
        window.dataLayer.push({ 'ecommerce': null });
        window.dataLayer.push(dataLayerObj);
    });
}
/* *************** END OF PURCHASE *************** */

