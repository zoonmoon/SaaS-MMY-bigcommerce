import { fakeCategories } from "../categories/fake"
import { fakeAttribs } from "./fake_attribs"
import { fakeSpecsRows } from "./fake_specs_rows"

function generateRandomString(length = 5) {
    const characters = "abcdefghijklmonpqr123";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
  
    return randomString;
}

function getRandomInteger(l1, l2) {
    return Math.floor(Math.random() * (l2 - l1 + 1)) + l1;
}

function generateAttribute(){
    let attribKey   = getRandomInteger(0, 4)
    let attribValueKey = getRandomInteger(0, 4) 
    return {
        key: fakeAttribs[attribKey].key,
        label: fakeAttribs[attribKey].key,
        value_key: fakeAttribs[attribKey].values[attribValueKey],
        value_label: fakeAttribs[attribKey].values[attribValueKey]
    }
}

function generateFitsOnSpecs(){
    return fakeSpecsRows[getRandomInteger(0, 99)]
}

export function generateProductRow(index){
    return(
        {
            store_hash: "bohaxauo",
            id: getRandomInteger(5000, 1000000),
            name: generateRandomString(),
            description: generateRandomString(20),
            price: getRandomInteger(1, 10000),
            stock: 5,
            categories: fakeCategories[getRandomInteger(0, fakeCategories.length - 1)].path,
            fits_on_specs: [generateFitsOnSpecs(), generateFitsOnSpecs(), generateFitsOnSpecs()],
            attributes: [generateAttribute(), generateAttribute(), generateAttribute()],
            images: ["https://abc.com"]
        }
    )
}