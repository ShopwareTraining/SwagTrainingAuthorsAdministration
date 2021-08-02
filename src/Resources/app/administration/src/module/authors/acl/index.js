Shopware.Service('privileges')
    .addPrivilegeMappingEntry({
        category: 'permissions',
        parent: 'settings',
        key: 'author',
        roles: {
            viewer: {
                privileges: [
                    'author:read'
                ]
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
