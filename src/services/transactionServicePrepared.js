/*
    order asc , desc => lastIndex의 > , < 결정
    lastIndex의 유무, => WHERE clause 하나 추가
*/

const { SequelizeScopeError } = require("sequelize")
const sequelize = require("sequelize")

const PAGE_SIZE_DEFAULT = 20
const PAGE_OFFSET_DEFAULT = 0

const accountFiltered = (origin, account) => {
    return ` 
        SELECT * 
        FROM (
                ${origin}
            ) accountFilteredOrigin
        WHERE
            accountFilteredOrigin.accountNumber = '${account}'
        `
}

const typeFiltered = (origin, type) => {
    return `
        SELECT * 
        FROM(
            ${origin}
            ) typeFilteredOrigin
        WHERE
            typeFilteredOrigin.transactionType = ${type == 'deposit' ? 0 : 1}            
    `
}

const idFiltered = (origin, id, order) => {
    if (order == 'ASC') {
        return `
            SELECT * 
            FROM(
                ${origin}
                ) idFilteredOrigin
            WHERE
            idFilteredOrigin.id > ${id}    
        `

    } else {
        return `
        SELECT * 
        FROM(
            ${origin}
            ) idFilteredOrigin
        WHERE
        idFilteredOrigin.id < ${id}    
    `
    }
}

const dateFilter = (tableName, begin, end) => {
    let beginStatement
    let endStatement
    if (begin) {
        beginStatement = `${tableName}.transactionDate >= TIMESTAMP("${begin}")`
    } else {
        beginStatement = undefined
    }

    if (end) {
        endStatement = `${tableName}.transactionDate < TIMESTAMP("${end}")`
    } else {
        endStatement = undefined
    }

    if (beginStatement && endStatement) {
        return `WHERE ${beginStatement} AND ${endStatement}`
    }

    if (!endStatement) {
        return `WHERE ${beginStatement}`
    }

    if (!beginStatement) {
        return `WHERE ${endStatement}`
    }

    return ``
}

const orderBy = (direction) => {
    return `ORDER BY id ${direction}`
}




/**
 * data : {
 *  accountNumber : ,
 *  begin : ,
 *  end : ,
 *  type : ,
 *  order : ,
 *  page : ,
 *  lastIndex : {
 *      value
 *      order
 * }
 * }
 */


module.exports.prepares = (data) => {

    console.log("building queries : ",data)

    var subQueries = accountFiltered('SELECT * FROM transactions',data.accountNumber)
    

    if(data.type == "deposit" || data.type == "withdraw"){
        subQueries = typeFiltered(subQueries,data.type)
    }

    var key = Object.keys(data.lastIndex).find(ele => ele < data.page)

    var isValidLastIndex= 
        data.page != 1 &&
        data.lastIndex && 
        key

    var isTypeSame =  
        data.type && 
        data.lastIndex.type &&
        data.type.toUpperCase() == data.lastIndex.type.toUpperCase()

    var isDateSame = 
        data.begin &&
        data.end &&
        data.lastIndex.begin &&
        data.lastIndex.end &&
        data.lastIndex.begin == data.begin &&
        data.lastIndex.end == data.end
       

    if(isValidLastIndex && isTypeSame && isDateSame){
        subQueries = idFiltered(subQueries,data.lastIndex[key],data.order ?? "ASC")
    }

    let fullQuery = `
        SELECT *
        FROM(       
                ${subQueries}
                
            ) subQueries
            
        ${dateFilter("subQueries", data.begin, data.end)}  
        
        ${orderBy(data.order ?? "ASC")}
        LIMIT ${data.limit ?? PAGE_SIZE_DEFAULT} ${isValidLastIndex ? "":`OFFSET ${data.offset ?? PAGE_OFFSET_DEFAULT}` };
    `
    return fullQuery
}









