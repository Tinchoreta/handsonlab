import PersistenceManager from '../Data/PersistenceManager.js';
import DataBaseStrategy from '../Data/DataBaseStrategy.js';
import CartModel from '../Models/CartModel.js';

class DataBaseCartManagerAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseCartManagerAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, CartModel));
        DataBaseCartManagerAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseCartManagerAdapter.instance) {
            DataBaseCartManagerAdapter.instance = new DataBaseCartManagerAdapter(uri);
        }
        return DataBaseCartManagerAdapter.instance;
    }

    async getCarts() {
        try {
            const data = await this.PersistenceManager.load();
            return data.map((cart) => cart.toJSON());
        } catch (error) {
            throw new Error(`getCarts: ${error.message}`);
        }
    }

    async getProductsIds(cartId) {
        try {
            const cart = await this.PersistenceManager.getOne({ id: parseInt(cartId) });
            return cart ? cart.products.map((product) => product.id) : [];
        } catch (error) {
            throw new Error(`getProductsIds: ${error.message}`);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await this.PersistenceManager.getOne({ id: parseInt(cartId) });
            return cart ? cart.toJSON() : null;
        } catch (error) {
            throw new Error(`getCartById: ${error.message}`);
        }
    };

    async createCart() {
        try {
            const cart = { id: null, products: [] };
            const createdCart = await this.PersistenceManager.addOne(cart);
            return createdCart.id;
        } catch (error) {
            throw new Error(`createCart: ${error.message}`);
        }
    }

    async updateCart(cartToUpdate) {
        try {
            const { id, products } = cartToUpdate;
            const cartId = parseInt(id);

            const cart = await this.PersistenceManager.getOne({ id: cartId });
            if (!cart) {
                throw new Error(`Cart with ID ${cartId} not found`);
            }

            const updatedCart = await this.PersistenceManager.modifyOne(
                { id: cartId },
                { ...cart, products }
            );

            return updatedCart.toJSON();
        } catch (error) {
            throw new Error(`updateCart: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.PersistenceManager.getOne({ id: parseInt(cartId) });
            if (!cart) {
                throw new Error(`Cart with ID: ${cartId} not found`);
            }

            const updatedProducts = cart.products.filter((product) => product.productId !== parseInt(productId));

            const updatedCart = await this.PersistenceManager.modifyOne(
                { id: cart.id },
                { products: updatedProducts }
            );

            if (!updatedCart) {
                throw new Error(`Product with ID ${productId} not found in cart ${cartId}`);
            }

            return updatedCart.toJSON();
        } catch (error) {
            throw new Error(`removeProductFromCart: ${error.message}`);
        }
    }

    async deleteCart(idToDelete) {
        try {
            const id = Number(idToDelete);
            if (isNaN(id)) {
                throw new Error(`Cart ID "${idToDelete}" is not a valid number`);
            }

            const isDeleted = await this.PersistenceManager.deleteOne({ id });

            if (!isDeleted) {
                throw new Error(`Cart with ID: ${idToDelete} not found`);
            }
        } catch (error) {
            throw new Error(`deleteCart: ${error.message}`);
        }
    }
}

export default DataBaseCartManagerAdapter;
