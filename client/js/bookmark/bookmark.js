'user strict';

angular.module('myApp')

.factory('Page', function($resource) {
		return $resource('/api/pages/:id', { id: '@_id' }, {
			update: { method: 'PUT' }
		});
})

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

.controller('BookmarkCtrl', function ($scope, Page, Category, Link, notify, $routeParams, $q, $location) {

	// $scope.linkPrefix = 'https://href.li/?';
	$scope.linkPrefix = '';
	var idToPageMap = {};
	var idToCategoryMap = {};
	$scope.loading = false;

	var pageId = $routeParams.pageId;

	var savedPageId = localStorage.getItem('PAGE_ID');

	if (pageId) {
		localStorage.setItem('PAGE_ID', pageId);
	}
	else {
		if (localStorage.getItem('PAGE_ID')) {
			pageId = localStorage.getItem('PAGE_ID');
			$location.path('bookmark/' + pageId);
		}
		else {
			Page.query().$promise.then(function(pages) {
				if(pages.length > 0) {
					pageId = pages[0]._id;
					localStorage.setItem('PAGE_ID', pageId);
					$location.path('bookmark/' + pageId);
				}
			});
		}
	}

	console.log('PageId: ', pageId);

	$scope.init = function() {
		$scope.loading = true;
		$scope.newCategory = null;
		$scope.newLink = {
			url: null,
			title: null,
			category: null
		}
		$scope.pages = [];
		$scope.categories = [];
		$scope.filteredCategories = [];
		$scope.links = [];
		$scope.currentPage = null;

		$scope.showAddLinkModal = false;
		$scope.showEditLinkModal = false;
		$scope.showEditCategoryModal = false;
		$scope.showEditPageModal = false;
		$scope.linkToEdit = null;
		$scope.categoryToEdit = null;
		$scope.pageToEdit = null;

		var pagePromise = Page.query().$promise;
		var categoryPromise = Category.query().$promise;
		var linkPromise = Link.query().$promise;

		$q.all([pagePromise, categoryPromise, linkPromise]).then(function(data){

			var pages = data[0];
			var categories = data[1];
			var links = data[2];

			idToPageMap = {};
			idToCategoryMap = {};

			$scope.pages = pages;

			angular.forEach($scope.pages, function(page) {
				idToPageMap[page._id] = page;
				page.categories = [];
			});


			$scope.categories = categories;

			angular.forEach($scope.categories, function(category) {
				idToCategoryMap[category._id] = category;
				category.links = [];
			});

			if (pageId) {
				$scope.currentPage = idToPageMap[pageId];
				angular.forEach($scope.categories, function(category) {
					if (category.page == pageId) {
						// console.log('matched: ', pageId);
						$scope.filteredCategories.push(category);
					}
				});
			}
			else {
				$scope.currentPage = {
					title: 'All Pages'
				};
				$scope.filteredCategories = $scope.categories;
			}

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
			notify('Error loading data ');
		});

	};

	$scope.addPage = function() {
		var page = new Page($scope.newPage);
		page.$save(function(){
			$scope.init();
		});
	}

	$scope.showEditPageForm = function(pageId) {
		$scope.pageToEdit = null;
		Page.get( { id: pageId }, function(page) {
			$scope.pageToEdit = page;
		});
		$scope.showEditPageModal = true;
	}

	$scope.hideEditPageForm = function(pageId) {
		$scope.showEditPageModal = false;
	}

	$scope.getPageTitleById = function(pageId) {
		if (idToPageMap[pageId]) {
			return idToPageMap[pageId].title;
		}
		else {
			return '';
		}
	}

	$scope.updatePage = function() {
		$scope.pageToEdit.$update(function(){
			$scope.init();
		});
	}

	$scope.deletePage = function(pageId) {
		Page.delete( { id: pageId }, function() {
			if (localStorage.getItem('PAGE_ID') && localStorage.getItem('PAGE_ID') == pageId) {
				pageId = localStorage.removeItem('PAGE_ID');
			}
			$scope.init();
		}, function(errResp) {
			notify('Error: ' + errResp.data.msg);
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
		if (pageId && idToPageMap[pageId]) {
			$scope.newCategory.page = pageId;
		}
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