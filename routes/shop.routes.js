import async from "async";
import {
  getCart,
  shopify,
  formatProduct,
  getProductTotalInventory,
} from "../apis/shopify.js";
import { capitalize } from "../modules/formatString/formatString.js";

export const post__shop_collection = (req, res, next) => {
  const collectionHandle = req.body.collectionHandle,
    count = req.body.count;

  async.waterfall(
    [
      (callback) => {
        shopify.collection
          .fetchByHandle(collectionHandle)
          .then((collection) => {
            const collectionId = collection.id;

            callback(null, collectionId);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      (collectionId, callback) => {
        shopify.collection
          .fetchWithProducts(collectionId, { productsFirst: count })
          .then((collection) => {
            callback(null, collection);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      (collection) => {
        return res.status(200).send(collection);
      },
    ],
    (err) => {
      return res.status(500).send(err);
    }
  );
};

export const post__shop_cart = (req, res) => {
  return getCart(req, res);
};

export const post__shop_addToCart = (req, res) => {
  const variantId = req.body.variantId;

  // return error if no item was sent
  if (variantId === undefined) {
    return res.status(500).send("No item selected, please try again.");
  }

  const line_item = {
      variantId,
      quantity: 1,
    },
    checkoutId = req.cookies["checkoutId"];

  // Add the variant to our cart
  shopify.checkout
    .addLineItems(checkoutId, line_item)
    .then((checkout) => {
      res.status(200).send(checkout);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

export const post__shop_modifyLineItem = (req, res) => {
  const checkoutId = req.cookies["checkoutId"],
    id = req.body.itemId,
    quantity = parseInt(req.body.quantity);

  console.log(checkoutId, id, quantity);

  // only works if we have a checkoutId
  if (checkoutId !== undefined) {
    if (quantity <= 0) {
      // then delete the product
      return shopify.checkout
        .removeLineItems(checkoutId, [id])
        .then((checkout) => {
          console.log(checkout);

          res.status(200).send(checkout);
        });
    } else {
      return shopify.checkout
        .updateLineItems(checkoutId, [{ id, quantity }])
        .then((checkout) => {
          console.log(checkout);
          res.status(200).send(checkout);
        });
    }
  } else {
    console.log("No checkoutId");
    return res.status(500).send("No checkoutId provided");
  }
};

export const enableShopRoutes = (app) => {
  app.post("/shop/collection", post__shop_collection);
  app.post("/shop/cart", post__shop_cart);
  app.post("/shop/add-to-cart", post__shop_addToCart);
  app.post("/shop/modify-line-item", post__shop_modifyLineItem);
};