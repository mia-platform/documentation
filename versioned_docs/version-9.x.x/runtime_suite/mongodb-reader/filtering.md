---
id: filtering
title: Filtering
sidebar_label: Filtering
---
You can build up filtered queries in two ways:

## Static filtering

Static filtering can be achieved by inserting `##paramName##` tags into the profile query; query string and path parameters are interpolated before processing the query.
Notes:
 - this filter strategy is only available when using `aggregationFilePath`;
 - all tags you define are required, if some query string is missing a `500` status code is returned;
 - if you need to interpolate numbers you have to omit the double quotes in your JSON file (leading to a syntactically wrong file)  

## Dynamic filtering

Dynamic filtering (available since `v1.3.0`) can be implemented with the `#matchWithFilters#` operator; you can use this filtering strategy with both `aggregationFilePath` and `aggregationFunction` and it will be substituted with a `$match` operator containing all the properties that match `requiredParameters` list. Values from the query string input are interpolated into the query property and the property gets inserted into the `$match` operator.

Notes: 
 * parameters to be interpolated in the query **must** be provided wrapped in single `#` as in `#paramName#`. It's different from what you specify for static filtering to avoid interpolation conflicts;
 * the `#matchWithFilters#` operator should be used as the single key inside a pipeline stage as you'd normally do with Mongodb aggregation stages. 

Sample configuration:

```
[
    { ...some pipeline stages },
    {
        "#matchWithFilters#": [
            {
                "requiredParameters": ["minValue", "maxValue"],
                "query": {
                    "total": { "$lte": "#maxValue#", "$gte": "#minValue#" }
                }
            }
        ]
    },
    { ...some pipeline stages }
]
```

will lead to (assuming both `minValue` and `maxValue` query string are provided)


```
[
    { ...some pipeline stages },
    {
        "$match": {
            "total": { "$lte": "#maxValue#", "$gte": "#minValue#" }
        }
    },
    { ...some pipeline stages }
]
```
