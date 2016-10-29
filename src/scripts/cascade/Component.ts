import Cascade from './Cascade';
import Computed from '../graph/Computed';
import VirtualNode from './VirtualNode';
import {IVirtualNode} from './IVirtualNode';

var componentContexts: Component<any>[][] = [];
var context: Component<any>[] = undefined;

export default class Component<T extends Object> implements IVirtualNode<T> {
    uniqueId: number;
    properties: T;
    children: Array<IVirtualNode<any> | string>;
    root: IVirtualNode<any> | string;
    element: Node;
    context: Component<any>[];

    constructor(properties?: T, ...children: Array<IVirtualNode<any> | string>) {
        this.uniqueId = Math.floor(Math.random() * 1000000);
        this.properties = properties || ({} as any);
        this.children = children || [];
        // This should subscribe to all observables used by render.
        Cascade.createComputed(this, 'root', () => {
            // Dispose of old context
            if (this.context) {
                for (var index = 0, length = this.context.length; index < length; index++) {
                    var computed = Cascade.getObservable(this.context[index], 'root') as Computed<any>;
                    computed.dispose();
                }
            }

            // Push this to the current context
            if (context) {
                context.push(this);
            }

            // Create a new context
            Component.pushContext();

            // Render
            var root = this.render();

            // Store the new context
            this.context = Component.popContext();
            return root;
        });//, true);
        Cascade.createComputed(this, 'element', () => {
            var root = this.root;
            var element: Node;
            if (typeof root === 'string') {
                element = document.createTextNode(root);
            } else {
                if (root instanceof Component) {
                    element = root.element;
                } else {
                    element = root.toNode();
                }
            }
            return element;
        }, true);
        /*
        Cascade.subscribe(this, 'element', (element: Node) => {
            var oldElement = this.element;
            if (oldElement) {
                var parentNode = oldElement.parentNode;
                if (parentNode) {
                    if (element) {
                        parentNode.replaceChild(element, oldElement);
                    } else {
                        parentNode.removeChild(element);
                    }
                }
            }
        });
        */
    }

    render(): IVirtualNode<any> | string {
        return this;
    }

    toNode() {
        var root = this.root;
        var element: Node;
        if (typeof root === 'string') {
            element = document.createTextNode(root);
        } else {
            if (root instanceof Component) {
                element = root.element;
            } else {
                element = root.toNode();
            }
        }
        return element;
    }

    static getContext() {
        return context;
    }

    static pushContext() {
        context = [];
        componentContexts.unshift(context);
        return context;
    }

    static popContext() {
        var oldContext = componentContexts.shift();
        context = componentContexts[0];
        return oldContext;
    }
}