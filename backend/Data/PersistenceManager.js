/*
Para la clase PersistenceManager se aplica también el patrón Strategy 
para permitir la utilización de diferentes estrategias de almacenamiento de datos 
(por ejemplo, archivos de texto plano, bases de datos, etc.).
*/

const fs = require('fs');

class PersistenceManager {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async save(data) {
        try {
            await this.strategy.save(data);
        } catch (error) {
            throw new Error('Error al guardar los datos');
        }
    }

    async load() {
        try {
            return await this.strategy.load();
        } catch (error) {
            throw new Error('Error al cargar los datos');
        }
    }
}

module.exports = PersistenceManager;