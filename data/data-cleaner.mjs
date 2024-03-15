
import fs from "fs";

class DataCleaner{
    constructor(file) {
        this.file = file

        this.json = JSON.parse(fs.readFileSync(file).toString());
    }

    required(field) {
        this.json = this.json.filter((value, index, array) => (!!this.json[index][field]));
        return this;
    }

    convertToNumber(field) {
        this.json.map((value, index, array) => {
            this.json[index][field] = this.json[index][field]?.replace(/[^0-9]/gm, "");
        });
    }

    save() {
        fs.writeFileSync(this.file, JSON.stringify(this.json, null, 2));
    }
}

// const tvCleaner = new DataCleaner("./tv.json");
// tvCleaner.convertToNumber("price");
// console.log(tvCleaner.json[0]);
// console.log(tvCleaner.json[1]);
// console.log(tvCleaner.json.length);

// tvCleaner.required("slug")
// .required("name")
// .required("price")
// .required("img_url")

// console.log(tvCleaner.json.length);
// console.log(tvCleaner.json[0]);
// console.log(tvCleaner.json[1]);
// console.log(tvCleaner.json);


// tvCleaner.save();