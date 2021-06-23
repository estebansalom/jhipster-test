package com.cenfotec.jtestproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Icon.
 */
@Entity
@Table(name = "icon")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Icon implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "icon")
    private String icon;

    @Column(name = "type")
    private String type;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "icon")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "categories", "transactions", "icon", "parent" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "icon")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "user", "icon" }, allowSetters = true)
    private Set<Wallet> wallets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Icon id(Long id) {
        this.id = id;
        return this;
    }

    public String getIcon() {
        return this.icon;
    }

    public Icon icon(String icon) {
        this.icon = icon;
        return this;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getType() {
        return this.type;
    }

    public Icon type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return this.name;
    }

    public Icon name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public Icon categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Icon addCategory(Category category) {
        this.categories.add(category);
        category.setIcon(this);
        return this;
    }

    public Icon removeCategory(Category category) {
        this.categories.remove(category);
        category.setIcon(null);
        return this;
    }

    public void setCategories(Set<Category> categories) {
        if (this.categories != null) {
            this.categories.forEach(i -> i.setIcon(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setIcon(this));
        }
        this.categories = categories;
    }

    public Set<Wallet> getWallets() {
        return this.wallets;
    }

    public Icon wallets(Set<Wallet> wallets) {
        this.setWallets(wallets);
        return this;
    }

    public Icon addWallet(Wallet wallet) {
        this.wallets.add(wallet);
        wallet.setIcon(this);
        return this;
    }

    public Icon removeWallet(Wallet wallet) {
        this.wallets.remove(wallet);
        wallet.setIcon(null);
        return this;
    }

    public void setWallets(Set<Wallet> wallets) {
        if (this.wallets != null) {
            this.wallets.forEach(i -> i.setIcon(null));
        }
        if (wallets != null) {
            wallets.forEach(i -> i.setIcon(this));
        }
        this.wallets = wallets;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Icon)) {
            return false;
        }
        return id != null && id.equals(((Icon) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Icon{" +
            "id=" + getId() +
            ", icon='" + getIcon() + "'" +
            ", type='" + getType() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
