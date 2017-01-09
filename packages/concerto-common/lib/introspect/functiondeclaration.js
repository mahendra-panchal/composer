/*
 * IBM Confidential
 * OCO Source Materials
 * IBM Concerto - Blockchain Solution Framework
 * Copyright IBM Corp. 2016
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

'use strict';

const TransactionDeclaration = require('./transactiondeclaration');
const IllegalModelException = require('./illegalmodelexception');
//const Globalize = require('../globalize');

/**
 * FunctionDeclaration defines a function that has been defined
 * in a model file. If the name of the function starts with 'on'
 * then the name of the function denotes the name of a transaction
 * declaration that the function processes.
 * @private
 * @class
 * @memberof module:ibm-concerto-common
 */
class FunctionDeclaration {

    /**
     * Create a FunctionDeclaration
     *
     * @param {ModelManager} modelManager - the ModelManager used to validate this function
     * @param {string} language - the language that the function is written in. E.g. JS.
     * @param {string} name - the name of the function
     * @param {string} visibility - the visibility of the function
     * @param {string} returnType - the return type of the function
     * @param {string} throws - the type that is thrown by the function
     * @param {string[]} parameterNames - the names of parameters of the function
     * @param {string[]} parameterTypes - the type names of parameters of the function
     * @param {string[]} decorators - the function decorators
     * @param {string} functionText - the function as text
     * @throws {IllegalModelException}
     */
    constructor(modelManager, language, name, visibility, returnType, throws, parameterNames, parameterTypes, decorators, functionText) {

        if(modelManager === null) {
            throw new Error('ModelManager is required.');
        }

        this.modelManager = modelManager;
        this.name = name;
        this.language = language;
        this.visibility = visibility;
        this.returnType = returnType;
        this.throws = throws;
        this.decorators = decorators;
        this.parameterNames = parameterNames;
        this.parameterTypes = parameterTypes;
        this.functionText = functionText;
    }

    /**
     * Visitor design pattern
     * @param {Object} visitor - the visitor
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    accept(visitor,parameters) {
        return visitor.visit(this, parameters);
    }

    /**
     * Returns the text of this function.
     *
     * @return {string} the text that defines the function
     */
    getFunctionText() {
        return this.functionText;
    }

    /**
     * Returns the type thrown by this function
     *
     * @return {string} the type thrown by the function
     */
    getThrows() {
        return this.throws;
    }

    /**
     * Returns the programming language that the function is written in
     *
     * @return {string} the language of the function
     */
    getLanguage() {
        return this.language;
    }

    /**
     * Returns the decorators that the function was tagged with
     *
     * @return {string[]} the @ prefixed decorators for the function
     */
    getDecorators() {
        return this.decorators;
    }

    /**
     * Returns the visibility of this function
     *
     * @return {string} the visibility of the function (+ is public),
     * (- is private)
     */
    getVisibility() {
        return this.visibility;
    }

    /**
     * Returns the return type for this function
     *
     * @return {string} the return type for the function
     */
    getReturnType() {
        return this.returnType;
    }

    /**
     * Semantic validation of the structure of this function.
     *
     * @throws {InvalidModelException}
     * @private
     */
    validate() {
        if(this.decorators.indexOf('transaction') > -1) {

            if(this.decorators.indexOf('query') > -1) {
                throw new Error('A function cannot be decorated with both @transaction and @query.');
            }

            if(this.parameterTypes.length !== 1) {
                throw new IllegalModelException('Transaction processing function ' + this.name + ' must have 1 function argument of type transaction.' );
            }
            const transactionClassName = this.parameterTypes[0];
            const classDecl = this.modelManager.getType(transactionClassName);

            if(!(classDecl instanceof TransactionDeclaration)) {
                throw new IllegalModelException('Function ' + this.getName() + ' processes ' + transactionClassName + ' which is not a transaction.');
            }
        }
    }

    /**
     * Returns the name of the function
     *
     * @return {string} the name of the function.
     */
    getName() {
        return this.name;
    }

    /**
     * Returns the short name of the transaction declaration
     * that is being processed. This is calculated by removing
     * the 'on' prefix from the function name.
     * If the function name does not start with 'on' then null
     *
     * @return {string} the name of the transaction declaration.
     */
    getTransactionDeclarationName() {
        if(this.name.startsWith('on')) {
            return this.name.substring(2);
        }
        else {
            return null;
        }
    }

    /**
     * Returns the names of the parameters processed by the function.
     *
     * @return {string[]} the names of the parameters.
     */
    getParameterNames() {
        return this.parameterNames;
    }

    /**
     * Returns the types of the parameters processed by the function.
     *
     * @return {string[]} the types of the parameters.
     */
    getParameterTypes() {
        return this.parameterTypes;
    }

    /**
     * Stop serialization of this object.
     * @return {Object} An empty object.
     */
    toJSON() {
        return {};
    }

}

module.exports = FunctionDeclaration;