const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information
const pool = new Pool({
        host:'localhost',
        user:'postgres',
        password:'Mw0395631',
        port:'5432',
        database:'financeMgmt'
  })

async function generalSelectAndReturnRows(query, queryParams){
    
    //if(pool)pool.end()

    //const client = await pool.connect()
    //await client.query(query, queryParams)
    return pool.query(query, queryParams)
    .then((res) =>{
        //pool.end()
        return res.rows
    }) 

}

/**
 input: endpoint
 output: 
    validation if that ep exists
    validation if the method exists on the ep
 */
function selectInformationSchema(ep, method){

    let jsonReturn = 
        {
            retcode:200,
            message:'',
            method:method,
            returnData:[]
        }

    return generalSelectAndReturnRows(
        `SELECT * 
        FROM ep 
        WHERE ep = $1`,
        [ep]
    )
    .then((epData) =>{
console.log(epData)
        if(epData.length < 1 || epData[0].ep !== ep ) {
            jsonReturn.retcode = 404
            jsonReturn.message = 'Not Found'
            return jsonReturn
        }
        
        if(epData[0][method] === false){
            jsonReturn.retcode = 405
            jsonReturn.message = 'Method Not Allowed'
            return jsonReturn
        }
            
        return generalSelectAndReturnRows(
            `SELECT * 
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE table_schema = 'public' AND table_name = $1 `,
            [epData[0].table_name]
        )
        .then((res) =>{

            jsonReturn.returnData = res
            return jsonReturn

        })
    })
    .catch((err)=>{
        pool.end()
        return console.log(err)
    })

}



module.exports.selectInformationSchema = selectInformationSchema