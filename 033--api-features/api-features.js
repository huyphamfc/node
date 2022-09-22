class APIFeatures {
    constructor(Model, query) {
        this.query = { ...query };
        this.result = Model.find();
    }

    filter() {
        let queryOfFiltering = { ...this.query };

        const excludedFields = ['sort', 'fields', 'page', 'limit'];
        excludedFields.forEach(property => delete queryOfFiltering[property]);

        queryOfFiltering = JSON
            .stringify(queryOfFiltering)
            .replace(/\b(gte|gt|lte|lt)/g, pattern => `$${pattern}`);
        queryOfFiltering = JSON.parse(queryOfFiltering);

        this.result = this.result.find(queryOfFiltering);

        return this;
    }

    sort() {
        if (this.query.sort) {
            this.result = this.result.sort(this.query.sort.replaceAll(',', ' '));
        } else {
            this.result = this.result.sort('name');
        }

        return this;
    }

    limitFields() {
        if (this.query.fields) {
            this.result = this.result.select(this.query.fields.replaceAll(',', ' '));
        } else {
            this.result = this.result.select('-address');
        }

        return this;
    }

    paginate() {
        if (!this.query.page && !this.query.limit) return this;

        const page = this.query.page || 1;
        const limit = this.query.limit || 3;
        const skip = (page - 1) * limit;
        this.result = this.result.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;