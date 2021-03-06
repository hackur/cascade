import { expect } from 'chai';

import Cascade, { VirtualNode, Component, observable } from '../scripts/modules/Cascade';

describe('Component.toNode', function () {
    it('should render a Node', function () {
        interface ICustomComponentProps {
            id: string;
            info: string;
        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return (
                    <div id={this.props.id}>Custom Component - {this.props.info}</div>
                );
            }
        }

        var root = (
            <CustomComponent id="child" info="test">text</CustomComponent>
        );

        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect(element.textContent).to.equal('Custom Component - test');
        });
    });

    it('should render falsy values', () => {
        interface ICustomComponentProps {

        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return (
                    <div>{this.children}</div>
                );
            }
        }

        var root = (
            <CustomComponent>0</CustomComponent>
        );

        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect((element.childNodes[0] as Text).data).to.equal('0');
        });
    });


    it('should render object values', () => {
        class ViewModel {
            @observable values: any[] = [];
        }

        interface ICustomComponentProps {
            viewModel: ViewModel;
        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return (
                    <ul>
                        {this.props.viewModel.values.map((value) => {
                            return (
                                value
                            );
                        })}
                    </ul>
                );
            }
        }

        var viewModel = new ViewModel();

        var root = (
            <CustomComponent viewModel={viewModel}></CustomComponent>
        );
        var element = document.createElement('div');
        Cascade.render(element, root);
        window.setTimeout(() => {
            viewModel.values.push(1);
            window.setTimeout(() => {
                viewModel.values.push(null);
                window.setTimeout(() => {
                    viewModel.values.push(2);
                    window.setTimeout(() => {
                        viewModel.values.push({});
                        window.setTimeout(() => {
                            viewModel.values.push(3);
                            window.setTimeout(() => {
                                viewModel.values.push(undefined);
                                window.setTimeout(() => {
                                    viewModel.values.push(4);
                                    window.setTimeout(() => {
                                        expect(element.childNodes[0].childNodes.length).to.equal(5);
                                    });
                                }, 20);
                            }, 0);
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        }, 0);
    });

    it('should pass children directly into high order Components', () => {
        let length = undefined;
        class Child extends Component<any> {
            render() {
                length = this.children.length;
                return <div>this.children</div>;
            }
        }
        class Parent extends Component<any> {
            render() {
                return (
                    <Child>{this.children}</Child>
                );
            }
        }
        class View extends Component<any>{
            render() {
                return (
                    <Parent>
                        <div>0</div>
                        <div>1</div>
                        <div>2</div>
                    </Parent>
                );
            }
        }

        var root = (
            <View />
        );

        var container = document.createElement('div');

        Cascade.render(container, root, function (element: HTMLElement) {
            expect(length).to.equal(3);
        });
    });
});