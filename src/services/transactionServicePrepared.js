const dotenv = require('dotenv');
dotenv.config();

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
        beginStatement = `${tableName}.transactionDate >= ${process.env.IS_SQLLITE? `datetime("${begin}")` : `TIMESTAMP("${begin}"`})`
    } else {
        beginStatement = undefined
    }

    if (end) {
        endStatement = `${tableName}.transactionDate < ${process.env.IS_SQLLITE? `datetime("${end}")` : `TIMESTAMP("${end}")`}`
    } else {
        endStatement = undefined
    }
    console.log("begin and end")
    console.log(beginStatement)
    console.log(endStatement)

    if (beginStatement && endStatement) {
        return `WHERE ${beginStatement} AND ${endStatement}`
    }

    if (beginStatement) {
        return `WHERE ${beginStatement}`
    }

    if (endStatement) {
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

    var key = Object.keys(data.lastIndex).find(ele => ele == data.page-1)

    var isValidLastIndex= 
        data.page != 1 &&   // 첫페이지를 조회하는게 아니고
        data.lastIndex &&   // 이전에 다른페이지를 본적이 있으며
        key                 // 그 페이지가 바로 이전 페이지라면

    var isTypeSame =  
        (!data.type && !data.lastIndex.type) ||  // 연속으로 입출금 내역을 다 뽑아보거나
        (data.lastIndex.type && 
        data.type.toUpperCase() == data.lastIndex.type.toUpperCase()) // 이전 내역이랑 똑같이 본다면

    var isDateSame = 
        ((!data.begin && !data.lastIndex.begin ) ||         //기간 시작점을 계속 지정하지 않거나
        (data.lastIndex.begin == data.begin ))              //같은 기간 시작점을 지정하고,
        &&   

        ((!data.end && !data.lastIndex.end) ||              // 기간 끝점을 계속 지정하지 않거나
        (data.lastIndex.end == data.end))                   // 같은 기간 끝점을 지정하면   
    
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
        LIMIT ${data.limit ?? PAGE_SIZE_DEFAULT} ${isValidLastIndex ? "":`OFFSET ${(data.page - 1) * (data.limit ?? PAGE_SIZE_DEFAULT) ?? PAGE_OFFSET_DEFAULT}` };
    `
    return fullQuery
}









