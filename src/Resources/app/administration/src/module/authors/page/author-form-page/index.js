import template from './template.html.twig';

const {Component, Mixin} = Shopware;

Component.register('swag-training-authors-form-page', {
    template,

    inject: [
        'repositoryFactory'
    ],

    mixins: [
        Mixin.getByName('notification'),
        Mixin.getByName('placeholder')
    ],

    metaInfo() {
        return {
            title: 'Authors form'
        };
    },

    data() {
        return {
            author: {},
            isLoading: false
        };
    },

    computed: {
        authorRepository() {
            return this.repositoryFactory.create('author');
        }
    },

    created() {
        this.author = this.authorRepository.create(Shopware.Context.api);

        if (!this.authorId) {
            this.authorId = this.$route.query.id;
            if (!this.authorId) {
                this.authorId = this.$route.params.id;
            }
        }

        if (this.authorId) {
            this.isLoading = true;
            this.authorRepository.get(this.authorId, Shopware.Context.api).then((author) => {
                if (author) {
                    this.author = author;
                }

                this.isLoading = false;
            });
        }
    },

    methods: {
        onSave() {
            this.isLoading = true;
            return this.authorRepository.save(this.author).then(() => {
                this.$router.push({name: 'swag.training.authors.index'});
            }).catch(() => {
                this.createNotificationError({
                    message: this.$tc('detail.form.notificationErrorMessage')
                });
                this.isLoading = false;
            });
        },

        onCancel() {
            this.$router.push({name: 'swag.training.authors.index'});
        }
    }
});
