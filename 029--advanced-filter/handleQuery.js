// url: ...?value[gte]=7

let query = {
  value: {
    gte: '7',
  },
}; // req.query

query = JSON.stringify(query); // {"value": {"gte":"7"}}

const pattern = /\b(gte|gt|lte|lt)/g;
query = query.replace(pattern, pattern => `$${pattern}`); // {"value": {"$gte":"7"}}

query = JSON.parse(query); // {value: {$gte:"7"}}
console.log(query);
