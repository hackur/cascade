import '../jsx/JSX';
export { Elements } from '../jsx/Elements';
export { IObservable, ISubscriber, ISubscriberFunction } from '../graph/IObservable';
export { default as Observable } from '../graph/Observable';
export { default as Computed } from '../graph/Computed';
export { default as ObservableArray } from '../graph/ObservableArray';
import { default as Graph } from '../graph/Graph';
export { observable, computed, array } from '../graph/Decorators';
export { IVirtualNode, IVirtualNodeProps } from '../cascade/IVirtualNode';
export { default as VirtualNode } from '../cascade/VirtualNode';
export { Component } from '../cascade/Component';
import { default as VirtualDom } from '../cascade/VirtualDom';

export default class Cascade {
    static createElement = VirtualDom.createElement;
    static render = VirtualDom.render;
    static attachGraph = Graph.attachGraph;
    static attachObservable = Graph.attachObservable;
    static createObservable = Graph.createObservable;
    static createObservableArray = Graph.createObservableArray;
    static createComputed = Graph.createComputed;
    static disposeAll = Graph.disposeAll;
    static peek = Graph.peek;
    static subscribe = Graph.subscribe;
    static getObservable = Graph.getObservable;
    static getSubscribers = Graph.getSubscribers;
    static getReferences = Graph.getReferences;
    static wrapContext = Graph.wrapContext;
}
