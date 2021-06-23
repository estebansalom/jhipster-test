package com.cenfotec.jtestproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserDetails.
 */
@Entity
@Table(name = "t_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country")
    private String country;

    @Column(name = "phone")
    private String phone;

    @JsonIgnoreProperties(value = { "invoice", "userDetails" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private License license;

    @OneToMany(mappedBy = "user")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "user", "icon" }, allowSetters = true)
    private Set<Wallet> wallets = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_t_user__contact",
        joinColumns = @JoinColumn(name = "t_user_id"),
        inverseJoinColumns = @JoinColumn(name = "contact_id")
    )
    @JsonIgnoreProperties(value = { "userDetails" }, allowSetters = true)
    private Set<Contact> contacts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDetails id(Long id) {
        this.id = id;
        return this;
    }

    public String getCountry() {
        return this.country;
    }

    public UserDetails country(String country) {
        this.country = country;
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhone() {
        return this.phone;
    }

    public UserDetails phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public License getLicense() {
        return this.license;
    }

    public UserDetails license(License license) {
        this.setLicense(license);
        return this;
    }

    public void setLicense(License license) {
        this.license = license;
    }

    public Set<Wallet> getWallets() {
        return this.wallets;
    }

    public UserDetails wallets(Set<Wallet> wallets) {
        this.setWallets(wallets);
        return this;
    }

    public UserDetails addWallet(Wallet wallet) {
        this.wallets.add(wallet);
        wallet.setUser(this);
        return this;
    }

    public UserDetails removeWallet(Wallet wallet) {
        this.wallets.remove(wallet);
        wallet.setUser(null);
        return this;
    }

    public void setWallets(Set<Wallet> wallets) {
        if (this.wallets != null) {
            this.wallets.forEach(i -> i.setUser(null));
        }
        if (wallets != null) {
            wallets.forEach(i -> i.setUser(this));
        }
        this.wallets = wallets;
    }

    public Set<Contact> getContacts() {
        return this.contacts;
    }

    public UserDetails contacts(Set<Contact> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public UserDetails addContact(Contact contact) {
        this.contacts.add(contact);
        contact.getUserDetails().add(this);
        return this;
    }

    public UserDetails removeContact(Contact contact) {
        this.contacts.remove(contact);
        contact.getUserDetails().remove(this);
        return this;
    }

    public void setContacts(Set<Contact> contacts) {
        this.contacts = contacts;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserDetails)) {
            return false;
        }
        return id != null && id.equals(((UserDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserDetails{" +
            "id=" + getId() +
            ", country='" + getCountry() + "'" +
            ", phone='" + getPhone() + "'" +
            "}";
    }
}
