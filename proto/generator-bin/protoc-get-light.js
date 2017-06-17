const protocPlugin = require('protoc-plugin');

// Only basic markup supported
// Types: bool, int32 and string
// No nested messages supported
// No error checking
// Produces ts and

protocPlugin(protos =>
    protos.map(proto => {
        return [
            {
                name: proto.name.replace(/\.proto$/, '.ts'),
                content: protoToTS(proto)
            },
            {
                name: proto.name.replace(/\.proto$/, '.c'),
                content: protoToC(proto, null, 2)
            }
        ]
    }).reduce((prev, curr) => prev.concat(curr), [])
)
    .then(() => {
        console.error('Complete.')
    });

const TS_ENUM_TEMPLATE =
    `export enum ::name:: {
    ::prop::
}
`;
const TS_CLASS_TEMPLATE =
    `export class ::name:: {
    constructor(
        public ::prop::
    ) {}
}
`;

function protoToTS(proto) {
    let res = '';
    res += proto.enumTypeList.map(message =>
            TS_ENUM_TEMPLATE
                .replace('::name::', message.name)
                .replace(/(\n.*)::prop::/,
                    (match, p1) =>  message.valueList
                        .map(val => p1 + val.name + ' = ' + val.number)
                        .join(',' ))
        )
        .join('\n');
    res += proto.messageTypeList.map(message =>
            TS_CLASS_TEMPLATE
                .replace('::name::', message.name)
                .replace(/(\n.*)::prop::/,
                    (match, p1) => message.fieldList
                        .map(val => p1 + val.name + ': ' + getFullTSType(val))
                        .join(','))
        )
        .join('\n');

    return res;
}

function getFullTSType(field) {
    return getTSType(field) + (field.label == 3 ? '[]' : '');
}

function getTSType(field) {
    switch(field.type) {
        case 5: return 'number';
        case 8: return 'boolean';
        case 9: return 'string';
        case 11:
            return field.typeName.substr(1); // To remove dot in start of typeName
        default:
            return 'any';
    }
}

function protoToC(proto) {
    return JSON.stringify(proto, null, 2);
}

