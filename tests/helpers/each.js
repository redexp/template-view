describe.skip('each helper', function () {
	it('should be empty', function () {
		var view = new TemplateView({
			node: '<ul><li></li></ul>',
			data: {
				test: []
			},
			template: {
				'@root': {
					each: {
						prop: 'test'
					}
				}
			}
		});

		expect(view.node.children().length).to.equal(0);
	});

	it('should not be empty', function () {
		var view = new TemplateView({
			node: '<ul><li></li></ul>',
			data: {
				test: [1, 'a', true]
			},
			template: {
				'@root': {
					each: {
						prop: 'test'
					}
				}
			}
		});

		expect(view.node.children().length).to.equal(3);
	});

	it('should handle item as simple value', function () {
		var view = new TemplateView({
			node: '<ul><li></li></ul>',
			data: {
				test: [1, 'a', true]
			},
			template: {
				'@root': {
					each: {
						prop: 'test',
						template: {
							'@root': {
								text: '=value'
							}
						}
					}
				}
			}
		});

		expect(view.node.children().eq(0)).to.have.text('1');
		expect(view.node.children().eq(1)).to.have.text('a');
		expect(view.node.children().eq(2)).to.have.text('true');
	});

	it('should handle item as object', function () {
		var view = new TemplateView({
			node: '<ul><li></li></ul>',
			data: {
				test: [{name: 'value1'}, {name: 'value2'}, {name: 'value3'}]
			},
			template: {
				'@root': {
					each: {
						prop: 'test',
						template: {
							'@root': {
								text: '=name'
							}
						}
					}
				}
			}
		});

		expect(view.node.children().eq(0)).to.have.text('value1');
		expect(view.node.children().eq(1)).to.have.text('value2');
		expect(view.node.children().eq(2)).to.have.text('value3');
	});

	it('node option as selector', function () {
		var view = new TemplateView({
			node: '<ul><li class="first"></li><li class="test"></li><li class="last"></li></ul>',
			data: {
				test: [1, 2]
			},
			template: {
				'@root': {
					each: {
						prop: 'test',
						node: '> .test'
					}
				}
			}
		});

		expect(view.node.children().length).to.equal(4);
		expect(view.node.children().eq(0)).to.have.class('first');
		expect(view.node.children().eq(1)).to.have.class('last');
		expect(view.node.children().eq(2)).to.have.class('test');
		expect(view.node.children().eq(3)).to.have.class('test');
	});

	it('node option as html', function () {
		var view = new TemplateView({
			node: '<ul><li class="first"></li></ul>',
			data: {
				test: [1, 2]
			},
			template: {
				'@root': {
					each: {
						prop: 'test',
						node: '<li class="test"></li>'
					}
				}
			}
		});

		expect(view.node.children().length).to.equal(3);
		expect(view.node.children().eq(0)).to.have.class('first');
		expect(view.node.children().eq(1)).to.have.class('test');
		expect(view.node.children().eq(2)).to.have.class('test');
	});

	it('view option as class', function () {
		var Test = TemplateView.extend({
			template: {
				'@root': {
					text: '=value'
				}
			}
		});

		var view = new TemplateView({
			node: '<ul><li></li></ul>',
			data: {
				test: [1, 2]
			},
			template: {
				'@root': {
					each: {
						prop: 'test',
						view: Test
					}
				}
			}
		});

		expect(view.node.children().length).to.equal(2);
		expect(view.node.children().eq(0)).to.have.text('1');
		expect(view.node.children().eq(1)).to.have.text('2');
	});

	it('view option as function which returns class', function () {
		var Test = TemplateView.extend({
			template: {
				'@root': {
					text: '=value'
				}
			}
		});

		var cb = sinon.spy(function () {
			return Test;
		});

		var view = new TemplateView({
			node: '<ul><li></li></ul>',
			data: {
				test: [1, 2]
			},
			template: {
				'@root': {
					each: {
						prop: 'test',
						view: cb,
						template: {
							'@root': {
								'prop': {
									'test': '=value'
								}
							}
						}
					}
				}
			}
		});

		expect(view.node.children().length).to.equal(2);
		expect(view.node.children().eq(0)).to.have.text('1').and.prop('test', 1);
		expect(view.node.children().eq(1)).to.have.text('2').and.prop('test', 2);

		expect(cb).to.have.callCount(2);
		expect(cb).to.be.calledOn(view);
		expect(cb.getCall(0).args[0]).to.equal(1);
		expect(cb.getCall(0).args[1]).to.be.instanceOf(TemplateView.$);
		expect(cb.getCall(1).args[0]).to.equal(2);
		expect(cb.getCall(1).args[1]).to.be.instanceOf(TemplateView.$);
	});

	it('view option as function which returns view', function () {
		var cb = sinon.spy(function (item, node) {
			return new TemplateView({
				node: node,
				data: {
					name: item
				},
				template: {
					'@root': {
						text: '=name'
					}
				}
			});
		});

		var view = new TemplateView({
			node: '<ul><li></li></ul>',
			data: {
				test: [1, 2]
			},
			template: {
				'@root': {
					each: {
						prop: 'test',
						view: cb
					}
				}
			}
		});

		expect(view.node.children().length).to.equal(2);
		expect(view.node.children().eq(0)).to.have.text('1');
		expect(view.node.children().eq(1)).to.have.text('2');

		expect(cb).to.have.callCount(2);
		expect(cb).to.be.calledOn(view);
		expect(cb.getCall(0).args[0]).to.equal(1);
		expect(cb.getCall(0).args[1]).to.be.instanceOf(TemplateView.$);
		expect(cb.getCall(1).args[0]).to.equal(2);
		expect(cb.getCall(1).args[1]).to.be.instanceOf(TemplateView.$);
	});

	it.skip('should listen add, remove of ArrayWrapper', function () {
		var view = new TemplateView({
			node: '<ul><li></li></ul>',

			data: {
				users: []
			},

			template: {
				'@root': {
					each: {
						prop: 'users',
						template: {
							'@root': {
								text: '=name'
							}
						}
					}
				}
			}
		});

		view.model('users').add({name: 'value1'});
		expect(view.node.children().length).to.equal(1);
		expect(view.node.children().eq(0)).to.have.text('value1');
		view.model('users').add([{name: 'value2'}, {name: 'value3'}]);
		expect(view.node.children().length).to.equal(3);
		expect(view.node.children().eq(0)).to.have.text('value1');
		expect(view.node.children().eq(1)).to.have.text('value2');
		expect(view.node.children().eq(2)).to.have.text('value3');
		view.model('users').add({name: 'value4'}, 1);
		expect(view.node.children().length).to.equal(4);
		expect(view.node.children().eq(0)).to.have.text('value1');
		expect(view.node.children().eq(1)).to.have.text('value4');
		expect(view.node.children().eq(2)).to.have.text('value2');
		expect(view.node.children().eq(3)).to.have.text('value3');
		view.model('users').add([{name: 'value5'}, {name: 'value6'}], 0);
		expect(view.node.children().length).to.equal(6);
		expect(view.node.children().eq(0)).to.have.text('value5');
		expect(view.node.children().eq(1)).to.have.text('value6');
		expect(view.node.children().eq(2)).to.have.text('value1');
		expect(view.node.children().eq(3)).to.have.text('value4');
		expect(view.node.children().eq(4)).to.have.text('value2');
		expect(view.node.children().eq(5)).to.have.text('value3');
		view.model('users').remove(view.data.users[1]);
		expect(view.node.children().length).to.equal(5);
		expect(view.node.children().eq(0)).to.have.text('value5');
		expect(view.node.children().eq(1)).to.have.text('value1');
		expect(view.node.children().eq(2)).to.have.text('value4');
		expect(view.node.children().eq(3)).to.have.text('value2');
		expect(view.node.children().eq(4)).to.have.text('value3');
		view.model('users').remove([view.data.users[1], view.data.users[3]]);
		expect(view.node.children().length).to.equal(3);
		expect(view.node.children().eq(0)).to.have.text('value5');
		expect(view.node.children().eq(2)).to.have.text('value4');
		expect(view.node.children().eq(4)).to.have.text('value3');
		view.model('users').removeAt(0);
		expect(view.node.children().length).to.equal(2);
		expect(view.node.children().eq(2)).to.have.text('value4');
		expect(view.node.children().eq(4)).to.have.text('value3');
		view.model('users').removeAt([1]);
		expect(view.node.children().length).to.equal(1);
		expect(view.node.children().eq(2)).to.have.text('value4');
		view.model('users').removeAll();
		expect(view.node.children().length).to.equal(0);
	});
});