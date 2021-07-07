Shopware.Service('privileges')
    .addPrivilegeMappingEntry({
        category: 'permissions',
        parent: 'settings',
        key: 'authors',
        roles: {
            editor: {
                privileges: [
                    'authors:update',
                    'authors:delete',
                    'authors:create'
                ]
            }
        }
    });
