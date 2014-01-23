#!/usr/bin/env python

#{
#    taxonomy:'fb',
#    name: 'sfa',
#    label: "Total spend",
#    amount: 2516322.48,
#    color: '#82bd27',
#    
#    children:[]
#}

import json

fd = open('budget.txt', 'r')
items = [l.strip().split('\t') for l in fd.readlines()]

data = { '1' : {} }
for item in items:
    d = data
    num, name, amount = item
    amount = float(amount.replace('$', '').replace(',',''))
    for n in num.split('.'):
        try:
            d = d[n]
        except KeyError:
            d[n] = {}
            d = d[n]
    d['name'] = name
    d['amount'] = amount

def build(d):
    b = {}
    b['taxonomy'] = 'fb'
    b['children'] = []
    for key, value in d.items():
        if key == 'name':
            b['name'] = value
            b['label'] = value
        elif key == 'amount':
            b['amount'] = value
        else:
            b['children'].append(build(value))
    return b

bubble = build(data['1'])
print json.dumps(bubble, indent=2)
    
    
