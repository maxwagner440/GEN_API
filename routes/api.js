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
         * Validate endpoint exists
         *  ep table?
         * Validate endpoint can do Request Method (GET,POST,PUT,DELETE,etc...)
         * General 400 or 500 error for request handling
         * 
         * NEEDS:
         *    Create DB string for general queries
         *      Need to do SELECT, UPDATE, CREATE, DELETE for general use
         *      
         *    Handle SQL errors
         *      Allow for a real-life error message to pass to UI
         *      Duplicate error/NatKey Violation
         *    
         *    Validate against NOT NULL columns
         *    Validate against natkeys with query from information_schema.columns  
         *    
         * Query INFORMATION_SCHEMA.COLUMNS to see what required fields exist for validation
         *      build ep schema based off of table ep refers to
         * 
         *    
         * 
         */
    router.use( async function(req, res, next){
        
        const ep = req.url.substring(1,req.url.length)
       //console.log(ep, req.method.toLocaleLowerCase())
        db.selectInformationSchema(ep,req.method.toLocaleLowerCase())
        .then((data) => {

            if(data && data.retcode  > 399){
                //let e = new Error(data.retcode, data.message)               
                return res.send(data.retcode, data.message)
            }  
           
            next()

        })
        
    })
 

 router.get('/sess', function(req,res){
    /* return db.selectInformationSchema()
    .then((data) => {
        //console.log(data)
        if(data.length < 1) return [];
         */
        res.send('data')
     /*  })  */
     //res.json({object_one:'this is an api test...you have passed'})
 })

 module.exports = router;


}())   
 