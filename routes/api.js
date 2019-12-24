(function(){
    'use strict';
    const express = require('express');
    const router = express.Router();
    const db = require('../database/database')
    //const https = require('https');
    const { check, body ,validationResult } = require('express-validator');
    

    
/*---------- API ----------*/
 
    //this will run before any other API ep's get hit
        /*
         * Authorize using session token
DONE     * Validate endpoint exists
DONE     *  ep table?
DONE     * Validate endpoint can do Request Method (GET,POST,PUT,DELETE,etc...)
DONE     * General 400 or 500 error for request handling
         * 
         * NEEDS:
         *    Create DB string for general queries
         *      Need to do SELECT, UPDATE, CREATE, DELETE for general use
         *      
         *    Handle SQL errors
         *      Allow for a real-life error message to pass to UI
         *      Duplicate error/NatKey Violation
         *    
DONE     *    Validate against NOT NULL columns
         *    Validate against natkeys with query from information_schema.columns  
         *    
         * Query INFORMATION_SCHEMA.COLUMNS to see what required fields exist for validation
         *      build ep schema based off of table ep refers to
         * 
         *    
         * 
         */

      

    async function createJsonSchemaFromArray(schemaArray){
        
        let schema = []
        schemaArray.map((column, index) => {
            schema[index] = {}
            schema[index].column_name = column.column_name
            schema[index].is_nullable = column.is_nullable
            schema[index].data_type = column.data_type
            schema[index].column_default = column.column_default
        })

        return schema

    }

    //input: method, schema, request body
    //output:   validating columns are there
    //          validating columns are correct data_type
    async function validateRequestAgainstEpSchema(method, epSchema, requestBody){
        //console.log(requestBody)
        let validateObject = {}
        validateObject.retcode = 1
        validateObject.message = ''

        let missingColumnArray = []

        if(method === 'get') return

        else if(method === 'post' || method === 'put'){
            
            //validates against required columns
            epSchema.map((column) => {
                //rules we implement against COLUMNS vs request body
                /* if not nullable and NO default, we will require column */
                if(column.is_nullable === 'NO' && column.column_default === null && !requestBody[column.column_name]){
                    missingColumnArray.push(column.column_name)
                    
                    //validates that NOT NULLABLE columns exist in request body
                    console.log('this is a required column: ',column.column_name) 
                }
                
            })

            if(missingColumnArray.length > 0){
                validateObject.retcode = -1
                validateObject.statusCode = 400
                validateObject.message = 'Missing Required Information'
                return validateObject
            } 
           /*  epSchema.map((column) => {

                // *
                // * Need to handle rp typeof
                // * Need to make symetrical data type values, i.e. number vs integer, string vs varchar
                // * Maybe pg handles this?
                // *

              
                 
                if(column.data_type !== typeof requestBody[column.column_name]){
                    // missingColumnArray.push(column.column_name)
                    console.log(column.column_name)
                    console.log('request data type ', typeof requestBody[column.column_name])
                    console.log('column data type ', column.data_type)
                    //validates that NOT NULLABLE columns exist in request body
                    //console.log('this is a required column: ',column.column_name) 
                }
                
            }) */

        }
        else if(method === 'delete'){

        }
            
        return validateObject
        
    }


    async function routerDBValidation(ep, method, request){

        let mainReturn = await db.selectInformationSchema(ep, method)

            if(mainReturn && mainReturn.retcode > 0){
                               
                //Creates EP schema
                const epSchema = await createJsonSchemaFromArray(mainReturn.returnData)
                //validated against NOT NULLABLE COLUMNS
                let validateEpObject = await validateRequestAgainstEpSchema(method, epSchema, request.body)
                
                if(validateEpObject.retcode < 1){
                    mainReturn.retcode = validateEpObject.retcode
                    mainReturn.statusCode = validateEpObject.statusCode
                    mainReturn.message = validateEpObject.message
                }
                
            }
           
            return mainReturn

    }

    router.use( async function(req, res, next){
        
        const ep = req.url.substring(1,req.url.length)
        const method = req.method.toLocaleLowerCase() 
        
        routerDBValidation(ep, method, req)
        .then((data) => {
            
            if(data.retcode < 1)  return res.status(data.statusCode).send(data.message)
            
            next()
        
        })
        
    })
 

router.get('/sess', function(req,res){

        res.send('data')
    
 })

 
 router.post('/sess', function(req,res){
        
        res.send('data')
   
 })

 router.put('/sess', function(req,res){
        
    res.send('data')

})

router.delete('/sess', function(req,res){
        
    res.send('data')

})

 module.exports = router;


}())   
 