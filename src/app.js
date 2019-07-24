chrome.bookmarks.getTree((root) => {
    const tree = document.getElementById('tree')
    let isBookmarkBar = true
    for (const node of root[0].children) {
        main(node, tree, isBookmarkBar)
        isBookmarkBar = false
    }
})

function main(bookmarkTreeNode, ul, isBookmarkBar) {
    if ('url' in bookmarkTreeNode) {
        addPageToTree(ul, bookmarkTreeNode.title, bookmarkTreeNode.url)
    } else if ('children' in bookmarkTreeNode) {
        const nextUl = addFolderToTree(ul, bookmarkTreeNode.title, isBookmarkBar)
        for (const node of bookmarkTreeNode.children) {
            main(node, nextUl, false)
        }
    }
}

function addPageToTree(ul, title, url) {
    const li = document.createElement('li')
    const a = document.createElement('a')

    li.classList.add('page-li')
    a.onclick = anchorOnClick
    a.href = url
    a.innerText = title

    li.appendChild(a)
    ul.appendChild(li)
}

function addFolderToTree(ul, title, expandedInDefault) {
    const li = document.createElement('li')
    const childUl = document.createElement('ul')

    li.classList.add('folder-li')
    childUl.innerText = title
    childUl.onclick = folderLiOnClick
    if (expandedInDefault) {
        childUl.classList.add('expanded')
    } else {
        childUl.classList.add('collapsed')
    }

    li.appendChild(childUl)
    ul.appendChild(li)

    return childUl
}

function openBookmarkHandler(url, newTab) {
    if (newTab) {
        chrome.tabs.create({ url })
    } else {
        chrome.tabs.getCurrent(tab => {
            chrome.tabs.update(tab.id, { url })
        })
    }
}

function anchorOnClick(event) {
    const url = event.target.href
    openBookmarkHandler(url, true)
}

function folderLiOnClick(event) {
    event.stopPropagation()
    const target = event.target
    const isExpanded = target.classList.contains('expanded') ? true : false
    console.log(isExpanded)

    if (isExpanded) {
        target.classList.remove('expanded')
        target.classList.add('collapsed')
    } else {
        target.classList.remove('collapsed')
        target.classList.add('expanded')
    }
}
