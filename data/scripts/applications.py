import json
from operator import itemgetter

fd = open('/tmp/sf/categories')
ls = [i.strip().split('\t') for i in fd.readlines()]
categories = [{'label': i[0], 'value': int(i[1]), 'category': 'category'} for i in ls]
fd.close()

fd = open('/tmp/sf/countries')
ls = [i.strip().split('\t') for i in fd.readlines()]
countries = [{'label': i[0], 'value': int(i[1]), 'category': 'country'} for i in ls]
fd.close()

items = sorted(categories, key=itemgetter('value'), reverse=True)
items.extend(sorted(countries, key=itemgetter('value')))

data = {
    'items': items,
    'applications': sum([i['value'] for i in items if i['category'] == 'country']),
    'countries': len(set([i['label'] for i in items if i['category'] == 'country'])),
    'categories': len(set([i['label'] for i in items if i['category'] == 'category'])),
    'male': 158,
    'female': 109
    }
json.dump(data, open('applications.json', 'w'), indent=2)
