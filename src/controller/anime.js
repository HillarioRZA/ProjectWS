const db = require("../database/connection");
module.exports = {
    create: async function (req, res) {
        const name = req.body.name || "";
        const publication_year =
            parseInt(req.body.publication_year) || 0;
        const category_id = parseInt(req.body.category_id) || 0;

        const [result0] = await db.query("select * from categories where id = ?", { replacements: [category_id] });

        if (result0.length <= 0) {
            return res.status(400).send({ msg: "category not found" });
        }

        const [result1] = await db.query("insert into books values (null, ?, ?, now(), now(), null, ?)", { replacements: [name, publication_year, category_id] });

        const [result2] = await db.query("select * from books where id = ?", { replacements: [result1] });

        return res.status(201).json(result2[0]);
    }
}