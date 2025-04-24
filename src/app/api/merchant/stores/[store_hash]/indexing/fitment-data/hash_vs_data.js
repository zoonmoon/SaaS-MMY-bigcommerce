import { sanitizeString } from "@/app/api/_lib/misc/utils";

export function hashVsNewData(dropdownColumns, columnContainingProductIDs, newData){

    try{

        let hashesVsRows = {}

        let pidVsHashes = {}

        newData.forEach(row => {
            
            let tempRow = {}

            let hashParts = []

            dropdownColumns.sort((a,b) => a.sort_order - b.sort_order).forEach(({label: col, key: col_key}) => {

                if(!( col in row)){
                    throw new Error(`Error - Data inconsistency -  '${col}' column in selected 
                        dropdown filters does not exist in Google Sheet`)
                }

                let value_label = row[col].trim()
                
                let value_key = sanitizeString(value_label) 
                
                tempRow[col_key] = {value_key, value_label} 
                
                hashParts.push(`${col_key}:${value_key}`)

            })
            
            if(!(columnContainingProductIDs in row)){
                throw new Error(`'${columnContainingProductIDs}' column does not exist in google sheet`)
            }
            
            // 123 | 34 | 234 | 456555 | 234 , ETC.

            tempRow[columnContainingProductIDs] = row[columnContainingProductIDs]
                .split('|')
                .map(eachId => eachId.trim()) 
                .filter(id => id.length != 0)
            
            let hash = hashParts.join('::')
            
            tempRow[columnContainingProductIDs].forEach(pid => {
                if(!(pid in pidVsHashes )){
                    pidVsHashes[pid] = [] 
                }
                if (!pidVsHashes[pid].includes(hash))
                    pidVsHashes[pid].push(hash)
                
            })

            tempRow['hash'] = hash

            hashesVsRows[hash] = tempRow

        });        

        return {hashesVsRows, pidVsHashes}

    }catch(error){

        console.log(error.message)
        throw error 

    }

}