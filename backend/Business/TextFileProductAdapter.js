const PersistenceManager = require('../Data/PersistenceManager');
const TextFileStrategy = require('../Data/TextFileStrategy');
class TextFileProductAdapter {

    // Define una propiedad privada estática para almacenar 
    // la única instancia de la clase Patrón Singleton. Se usa static para
    // dejar en claro que es una propiedad de la clase y no de instancias de la misma.

    static instance;

    // Constructor privado para evitar la creación de nuevas instancias 
    //fuera de la clase

    constructor(filePath) {
        if (TextFileProductAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.PersistenceManager = new PersistenceManager(new TextFileStrategy(filePath));
        TextFileProductAdapter.instance = this;
    }

    // Método estático para obtener la instancia única de la clase TextFileProductAdapter
    static getInstance(filePath) {
        if (!TextFileProductAdapter.instance) {
            TextFileProductAdapter.instance = new TextFileProductAdapter(filePath);
        }
        return TextFileProductAdapter.instance;
    }

    // Métodos de la clase TextFileProductAdapter
    // que van a ser 

    async getProducts() {
        try {
            const products = await this.PersistenceManager.load();
            if (products.length === 0) {
                throw new Error('Not found');
            }
            return products;
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    }


    async getProductById(idProduct) {
        try {
            const products = await this.PersistenceManager.load();
            if (products.length === 0 || products ==='null' || products === 'undefined') {
                throw new Error('Not found');
            }
            const found = products.find((product) => product.id === parseInt(idProduct));
            if (!found) {
                throw new Error("Not found");
            }
            return found;
        } catch (error) {
            throw new Error(`getProducts: ${error.message}`);
        }
    };

    async addProduct(addedProduct) {
        try {
            const { title, description, price, thumbnail, stock } = addedProduct;
            const products = await this.PersistenceManager.load();
            const newProduct = { id: products.length + 1, title, description, price, thumbnail, stock };
            products.push(newProduct);
            await this.PersistenceManager.save(products);
            return newProduct.id;
        } catch (error) {
            throw new Error(`addProduct: ${error.message}`);
        }
    }


    async updateProduct(id, productData) {
        try {
            const products = await this.PersistenceManager.load();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error(`Producto con ID: ${id} no encontrado`);
            }
            const { title, description, price, thumbnail, stock } = productData;
            //en caso de que no se modifiquen todas las propiedades, 
            //se deja el valor que tenían.
            title = title ?? title;
            description = description ?? description;
            price = price ?? price;
            thumbnail = thumbnail ?? thumbnail;
            stock = stock ?? stock;
            const editedProduct = { id, title, description, price, thumbnail, stock };
            products[productIndex] = editedProduct;
            await this.PersistenceManager.save(products);
            return editedProduct;
        } catch (error) {
            throw new Error(`updateProduct: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.PersistenceManager.load();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error(`Producto con ID: ${id} no encontrado`);
            }
            products.splice(productIndex, 1);
            await this.PersistenceManager.save(products);
        } catch (error) {
            throw new Error(`deleteProduct: ${error.message}`);
        }
    }
}

module.exports = TextFileProductAdapter;