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
        beginStatement = `${tableName}.transactionDate >= ${process.env.IS_SQLLITE ? `datetime("${begin}")` : `TIMESTAMP("${begin}"`})`
    } else {
        beginStatement = undefined
    }

    if (end) {
        endStatement = `${tableName}.transactionDate < ${process.env.IS_SQLLITE ? `datetime("${end}")` : `TIMESTAMP("${end}")`}`
    } else {
        endStatement = undefined
    }

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
 *  accountNumber : ,         // 요청 계좌
 *  begin : ,                 // 검색 시작 시점
 *  end : ,                   // 검색 종료 시점
 *  type : ,                  // 입,출금 혹은 전체 선택
 *  order : ,                 // 오름차순, 내림차순
 *  page : ,                  // 조회하고자 하는 page
 *  lastIndex : {
 *          ${page} : {       // 이전 조회 요청 내용
 *              accountNumber
 *              begin
 *              end
 *              type
 *              order
 *          }
 *  }
 */


module.exports.prepares = (data) => {


    var subQueries = accountFiltered('SELECT * FROM transactions', data.accountNumber)


    if (data.type == "deposit" || data.type == "withdraw") {
        subQueries = typeFiltered(subQueries, data.type)
    }
    

    if (data.lastIndex) {                                                           //지난 조회값이 존재한다고 할때,
        var isSameAccount = data.lastIndex && (data.accountNumber
            == data.lastIndex.accountNumber)                                        //같은 계좌를 조회하고

        var isValidLastIndex =
            data.page != 1 &&                                                       // 첫페이지를 조회하는게 아니고                                                           
            data.page == data.lastIndex.page + 1                                    // 그 페이지가 바로 이전 페이지라면

        var isTypeSame =
            (!data.type && !data.lastIndex.type) ||                                 // 연속으로 입출금 내역을 다 뽑아보거나
            (data.lastIndex.type &&
                data.type.toUpperCase() == data.lastIndex.type.toUpperCase())       // 이전 내역이랑 똑같이 본다면

        var isDateSame =
            ((!data.begin && !data.lastIndex.begin) ||                              //기간 시작점을 계속 지정하지 않거나
                (data.lastIndex.begin == data.begin))                               //같은 기간 시작점을 지정하고,
            &&

            ((!data.end && !data.lastIndex.end) ||                                  // 기간 끝점을 계속 지정하지 않거나
                (data.lastIndex.end == data.end))                                   // 같은 기간 끝점을 지정하면   
        
        if (isSameAccount && isValidLastIndex && isTypeSame && isDateSame) {
            subQueries = idFiltered(subQueries, data.lastIndex.value, data.order ?? "ASC")
        }
    }

    let fullQuery = `
        SELECT *
        FROM(       
                ${subQueries}
                
            ) subQueries
            
        ${dateFilter("subQueries", data.begin, data.end)}  
        
        ${orderBy(data.order ?? "ASC")}
        LIMIT ${data.limit ?? PAGE_SIZE_DEFAULT} ${isValidLastIndex ? "" : `OFFSET ${(data.page - 1) * (data.limit ?? PAGE_SIZE_DEFAULT) ?? PAGE_OFFSET_DEFAULT}`};
    `
    return fullQuery
}









