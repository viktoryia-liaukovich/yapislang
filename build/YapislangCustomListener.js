import YapislangParserListener from './YapislangParserListener';

export default class YapislangCustomListener extends YapislangParserListener {
  OUTER_SCOPE = []
  VARS = {
    'string[]': new Map(),
    'string': new Map(),
    'char': new Map(),
    'int': new Map(),
    'bool': new Map(),
  }
  FUNCTIONS = new Map()

  enterFunctionDeclaration(ctx) {
    console.log('declaring function', ctx.identifier().getText());
  }

  enterFunctionBody(ctx) {
    const newVars = {};
    Object.keys(this.VARS).forEach((type) => {
      newVars[type] = new Map(this.VARS[type])
    })

    this.OUTER_SCOPE.push(newVars)
    
    Object.values(this.VARS).forEach(map => map.clear())
  }

  exitFunctionBody(ctx) {
    this.VARS = {...this.OUTER_SCOPE.pop()}
  }

  exitVariableDeclarationList(ctx) {
    const type = ctx.varModifier().getText()
    const name = ctx.variableDeclaration().assignable().getText()
    const value = (ctx.variableDeclaration().singleExpression() && ctx.variableDeclaration().singleExpression().getText()) || undefined;

    if (this.VARS[type]) {
      if (!Object.values(this.VARS).some(map => map.has(name))) {
        console.log('declaring var', name, 'of type', type, 'equal', value)
        this.VARS[type].set(name, value)
      } else {
        console.error(`Error: Identifier ${name} has already been declared`)
      }
    } else {
      console.error(`Error: No such type ${type}` )
    }
  }
}