package com.cenfotec.jtestproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Category.
 */
@Entity
@Table(name = "t_category")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "parent")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "categories", "transactions", "icon", "parent" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "category")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "attachments", "wallet", "currency", "category" }, allowSetters = true)
    private Set<Transaction> transactions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "categories", "wallets" }, allowSetters = true)
    private Icon icon;

    @ManyToOne
    @JsonIgnoreProperties(value = { "categories", "transactions", "icon", "parent" }, allowSetters = true)
    private Category parent;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Category id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Category name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public Category categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Category addCategory(Category category) {
        this.categories.add(category);
        category.setParent(this);
        return this;
    }

    public Category removeCategory(Category category) {
        this.categories.remove(category);
        category.setParent(null);
        return this;
    }

    public void setCategories(Set<Category> categories) {
        if (this.categories != null) {
            this.categories.forEach(i -> i.setParent(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setParent(this));
        }
        this.categories = categories;
    }

    public Set<Transaction> getTransactions() {
        return this.transactions;
    }

    public Category transactions(Set<Transaction> transactions) {
        this.setTransactions(transactions);
        return this;
    }

    public Category addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.setCategory(this);
        return this;
    }

    public Category removeTransaction(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.setCategory(null);
        return this;
    }

    public void setTransactions(Set<Transaction> transactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setCategory(null));
        }
        if (transactions != null) {
            transactions.forEach(i -> i.setCategory(this));
        }
        this.transactions = transactions;
    }

    public Icon getIcon() {
        return this.icon;
    }

    public Category icon(Icon icon) {
        this.setIcon(icon);
        return this;
    }

    public void setIcon(Icon icon) {
        this.icon = icon;
    }

    public Category getParent() {
        return this.parent;
    }

    public Category parent(Category category) {
        this.setParent(category);
        return this;
    }

    public void setParent(Category category) {
        this.parent = category;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Category)) {
            return false;
        }
        return id != null && id.equals(((Category) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Category{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
