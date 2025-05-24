// validator.js
import Schema from 'async-validator'
Schema.messages.required = fieldFun('该字段为必填项')
Schema.messages.types.string = fieldFun('类型错误,应为字符串')
Schema.messages.types.array = fieldFun('类型错误,应为数组')
Schema.messages.types.object = fieldFun('类型错误,应为对象')
Schema.messages.types.number = fieldFun('类型错误,应为数字')
Schema.messages.types.date = fieldFun('类型错误,应为日期格式')

function fieldFun(message) {
    return () => {
        return message
    }
}
