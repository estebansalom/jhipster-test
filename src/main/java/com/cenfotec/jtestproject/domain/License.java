package com.cenfotec.jtestproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A License.
 */
@Entity
@Table(name = "license")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class License implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties(value = { "license" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Invoice invoice;

    @JsonIgnoreProperties(value = { "license", "wallets", "contacts" }, allowSetters = true)
    @OneToOne(mappedBy = "license")
    private UserDetails userDetails;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public License id(Long id) {
        this.id = id;
        return this;
    }

    public Invoice getInvoice() {
        return this.invoice;
    }

    public License invoice(Invoice invoice) {
        this.setInvoice(invoice);
        return this;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public UserDetails getUserDetails() {
        return this.userDetails;
    }

    public License userDetails(UserDetails userDetails) {
        this.setUserDetails(userDetails);
        return this;
    }

    public void setUserDetails(UserDetails userDetails) {
        if (this.userDetails != null) {
            this.userDetails.setLicense(null);
        }
        if (userDetails != null) {
            userDetails.setLicense(this);
        }
        this.userDetails = userDetails;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof License)) {
            return false;
        }
        return id != null && id.equals(((License) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "License{" +
            "id=" + getId() +
            "}";
    }
}
