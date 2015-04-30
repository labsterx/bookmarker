'user strict';

angular.module('myApp')

.factory('Category', function($resource) {
		return $resource('/api/categories/:id', { id: '@_id' }, {
			update: { method: 'PUT' }
		});
})

.factory('Link', function($resource) {
		return $resource('/api/links/:id', { id: '@_id' }, {
			update: { method: 'PUT' }
		});
})

.controller('BookmarkCtrl', function ($scope, Category, Link, notify) {

	// $scope.linkPrefix = 'https://href.li/?';
	$scope.linkPrefix = '';
	var idToCategoryMap = {};
	$scope.loading = false;

	$scope.init = function() {
		$scope.loading = true;
		$scope.newCategory = null;
		$scope.newLink = {
			url: null,
			title: null,
			category: null
		}
		$scope.categories = [];
		$scope.links = [];

		$scope.showAddLinkModal = false;
		$scope.showEditLinkModal = false;
		$scope.showEditCategoryModal = false;
		$scope.linkToEdit = null;
		$scope.categoryToEdit = null;

		Category.query().$promise.then(function(categories) {

			idToCategoryMap = {};
			$scope.categories = categories;
			angular.forEach($scope.categories, function(category) {
				idToCategoryMap[category._id] = category;
				category.links = [];
			});

			Link.query().$promise.then(function(links) {
				$scope.links = links;
				angular.forEach(links, function(link) {
					var matchedCategory = idToCategoryMap[link.category];
					if (matchedCategory) {
						matchedCategory.links.push(link);
					}
				});
				$scope.loading = false;
			}, function(errResp) {
				$scope.loading = false;
				notify('Error loading links: ' + errResp.data.msg);
			});

		}, function(errResp) {
			$scope.loading = false;
			notify('Error loading categories: ' + errResp.data.msg);
		});

	}

	$scope.getCategoryTitleById = function(categoryId) {
		if (idToCategoryMap[categoryId]) {
			return idToCategoryMap[categoryId].title;
		}
		else {
			return '';
		}
	}

	$scope.addCategory = function() {
		var category = new Category($scope.newCategory);
		category.$save(function(){
			$scope.init();
		});
	}

	$scope.showEditCategoryForm = function(categoryId) {
		$scope.categoryToEdit = null;
		Category.get( { id: categoryId }, function(category) {
			$scope.categoryToEdit = category;
		});
		$scope.showEditCategoryModal = true;
	}

	$scope.hideEditCategoryForm = function(categoryId) {
		$scope.showEditCategoryModal = false;
	}

	$scope.updateCategory = function() {
		$scope.categoryToEdit.$update(function(){
			$scope.init();
		});
	}

	$scope.deleteCategory = function(categoryId) {
		Category.delete( { id: categoryId }, function() {
			$scope.init();
		}, function(errResp) {
			notify('Error: ' + errResp.data.msg);
		});
	}

	$scope.showAddLinkForm = function(categoryId) {
		console.log(categoryId);
		if (categoryId) {
			$scope.newLink.category = categoryId;
		}
		$scope.showAddLinkModal = true;
	}

	$scope.hideAddLinkForm = function() {
		$scope.showAddLinkModal = false;
	}

	$scope.addLink = function() {
		var link = new Link($scope.newLink);
		link.$save(function(){
			$scope.init();
		}, function(errResp) {
			notify('Error : ' + errResp.data.msg);
		});
	}

	$scope.showEditLinkForm = function(linkId) {
		$scope.linkToEdit = null;
		Link.get( { id: linkId }, function(link) {
			$scope.linkToEdit = link;
		});
		$scope.showEditLinkModal = true;
	}

	$scope.hideEditLinkForm = function(categoryId) {
		$scope.showEditLinkModal = false;
	}

	$scope.updateLink = function() {
		$scope.linkToEdit.$update(function(){
			$scope.init();
		}, function(errResp) {
			notify('Error : ' + errResp.data.msg);
		});
	}

	$scope.deleteLink = function(linkId) {
		Link.delete( { id: linkId }, function() {
			$scope.init();
		}, function(errResp) {
			notify('Error : ' + errResp.data.msg);
		});
	}

	$scope.init();

});