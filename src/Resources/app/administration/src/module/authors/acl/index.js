Shopware.Service('privileges')
    .addPrivilegeMappingEntry({
        category: 'permissions',
        parent: null,
        key: 'author',
        roles: {
            viewer: {
                privileges: [
                    'author:read'
                ],
                dependencies: []
            },
            creator: {
                privileges: [
                    'author:create'
                ],
                dependencies: [
                    'author.viewer',
                    'author.editor'
                ]
            },
            editor: {
                privileges: [
                    'author:update'
                ],
                dependencies: [
                    'author.viewer'
                ]
            },
            deleter: {
                privileges: [
                    'author:delete'
                ],
                dependencies: [
                    'author.viewer'
                ]
            }
        }
    });
