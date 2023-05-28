import axios from 'axios';

class ProductViewController {
  constructor() { }

  renderAddProductForm(req, res) {
    try {
      return res.render("addProduct", {
        title: "Product add Form",
        script: "addProduct.js",
        css: "addProduct.css",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }

  async renderProductsForm(req, res) {
    try {
      const response = await axios.get("http://localhost:8080/api/products/");
      const products = response.data.response;

      return res.render("products", {
        title: "Products",
        script: "products.js",
        css: "products.css",
        products: products
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }

  async renderProductDetailsForm(req, res, productId) {
    try {
      // console.log(`http://localhost:8080/api/products/${productId}`);
      const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
      const productDetails = response.data.product;
      
      return res.render("productDetails", {
        title: "Product Details",
        script: "productDetails.js",
        css: "productDetails.css",
        productDetails: productDetails
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }

  renderAddProductResponse(req, res, success, message) {
    const data = {
      success: true,
      message: message,
      css: "addProduct.css",
    };
    res.render("addProduct", data);
  }
}

export default ProductViewController;