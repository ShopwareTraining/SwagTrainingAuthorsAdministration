import template from './template.html.twig';
import './style.scss';

const {Component, Mixin} = Shopware;

Component.register('author-form-page', {
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
            isSaveSuccessful: false
        };
    },

    computed: {
        identifier() {
            return this.placeholder(this.author, 'name');
        },
        authorRepository() {
            return this.repositoryFactory.create('author');
        }
    },

    watch: {
        authorId() {
            if (!this.authorId) {
                this.createdComponent();
            }
        }
    },

    created() {
        this.getAuthor();
    },

    methods: {
        getAuthor() {
            this.isLoading = true;
            if (!this.authorId) {
                this.authorId = this.$route.query.id;
                if (!this.authorId) {
                    this.authorId = this.$route.params.id;
                }

                this.authorRepository.get(this.authorId, Shopware.Context.api).then((result) => {
                    this.author = result;
                    this.isLoading = false;
                });
            }
        },

        loadEntityData() {
            this.author = this.authorRepository.get(this.authorId, Shopware.Context.api).then((author) => {
                this.author = author;
            });
        },

        saveFinish() {
            this.isSaveSuccessful = false;
        },

        onSave() {
            this.isSaveSuccessful = false;
            this.isLoading = true;

            return this.authorRepository.save(this.author, Shopware.Context.api).then(() => {
                this.isSaveSuccessful = true;
                if (!this.authorId) {
                    this.$router.push({ name: 'author.form', params: { id: this.author.id } });
                }

                this.authorRepository.get(this.author.id, Shopware.Context.api).then((updatedCurrency) => {
                    this.author = updatedCurrency;
                    this.isLoading = false;
                });
            }).catch(() => {
                this.createNotificationError({
                    message: this.$tc('detail.form.notificationErrorMessage')
                });
                this.isLoading = false;
            });
        },

        onCancel() {
            this.$router.push({ name: 'author.index' });
        },
    }
});
