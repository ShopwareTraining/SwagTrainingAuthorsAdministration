import template from './template.html.twig';
import './style.scss';

const {Component, Mixin} = Shopware;

Component.register('swag-training-authors-form-page', {
    template,

    inject: [
        'repositoryFactory',
        'acl'
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
            isLoading: false,
            datepickerConfig: {
                dateFormat: "Y-m-d"
            }
        };
    },

    computed: {
        authorRepository() {
            return this.repositoryFactory.create('author');
        }
    },

    created() {
        this.loadAuthor();
    },

    methods: {
        loadAuthor() {
            this.isLoading = true;
            this.author = this.authorRepository.create(Shopware.Context.api);
            this.loadAuthorId();

            this.authorRepository.get(this.authorId, Shopware.Context.api).then((author) => {
                if (author) {
                    this.author = author;
                }

                this.isLoading = false;
            });
        },

        loadAuthorId() {
            if (!this.authorId) {
                this.authorId = this.$route.query.id;
                if (!this.authorId) {
                    this.authorId = this.$route.params.id;
                }
            }
        },

        onSave() {
            this.isLoading = true;
            return this.authorRepository.save(this.author, Shopware.Context.api).then(() => {
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
