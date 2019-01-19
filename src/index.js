/**
 * Babel Plugin For Providing safe access to object properties
 *
 * Transforms:
 * let a = b.c.d; => let a = ((b || {}).c || {}).d;
 * a = b.d[e]; => a = ((b || {}).d || {})[e];
 */

function transform(babel) {
    const { types: t } = babel;

    return {
        visitor: {
            MemberExpression(path, state) {
                let { node } = path;
                let nextPath = path;

                if (t.isIdentifier(node.object)) {
                    const assignmentParent = nextPath.findParent(path => path.isAssignmentExpression());
                    if (assignmentParent && t.isMemberExpression(assignmentParent.get('left'))) {
                        let sequenceExpressions = [];
                        sequenceExpressions.push(t.assignmentExpression('=', t.identifier(node.object.name), t.logicalExpression('||', t.identifier(node.object.name), t.objectExpression([]))))

                        while (t.isMemberExpression(nextPath.parentPath.node.object)) {
                            const { property, computed } = nextPath.node;

                            nextPath = nextPath.parentPath;
                            let memberExpression = t.memberExpression(node.object, property, computed);
                            sequenceExpressions.push(t.assignmentExpression('=', memberExpression, t.logicalExpression('||', memberExpression, t.objectExpression([]))))

                            node = nextPath.node;
                        };

                        sequenceExpressions.push(assignmentParent.node);
                        assignmentParent.replaceWith(t.sequenceExpression(sequenceExpressions));

                        assignmentParent.stop();
                    } else {
                        node.object = t.logicalExpression('||', t.identifier(node.object.name), t.objectExpression([]));

                        while (t.isMemberExpression(nextPath.parentPath.node.object)) {
                            const { property, computed } = nextPath.node;

                            nextPath = nextPath.parentPath;
                            nextPath.node.object = t.logicalExpression('||', t.memberExpression(node.object, property, computed), t.objectExpression([]));

                            node = nextPath.node;
                        }
                    }
                }
            }
        }
    };
};

module.exports = transform;
