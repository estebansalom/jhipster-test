package com.cenfotec.jtestproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Transaction.
 */
@Entity
@Table(name = "t_transaction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "amount")
    private Float amount;

    @Column(name = "type")
    private String type;

    @Column(name = "periodic")
    private Boolean periodic;

    @OneToMany(mappedBy = "transaction")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transaction" }, allowSetters = true)
    private Set<Attachment> attachments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "transactions", "user", "icon" }, allowSetters = true)
    private Wallet wallet;

    @ManyToOne
    @JsonIgnoreProperties(value = { "transactions" }, allowSetters = true)
    private Currency currency;

    @ManyToOne
    @JsonIgnoreProperties(value = { "categories", "transactions", "icon", "parent" }, allowSetters = true)
    private Category category;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Transaction id(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Transaction name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Transaction description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Transaction date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Float getAmount() {
        return this.amount;
    }

    public Transaction amount(Float amount) {
        this.amount = amount;
        return this;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public String getType() {
        return this.type;
    }

    public Transaction type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getPeriodic() {
        return this.periodic;
    }

    public Transaction periodic(Boolean periodic) {
        this.periodic = periodic;
        return this;
    }

    public void setPeriodic(Boolean periodic) {
        this.periodic = periodic;
    }

    public Set<Attachment> getAttachments() {
        return this.attachments;
    }

    public Transaction attachments(Set<Attachment> attachments) {
        this.setAttachments(attachments);
        return this;
    }

    public Transaction addAttachment(Attachment attachment) {
        this.attachments.add(attachment);
        attachment.setTransaction(this);
        return this;
    }

    public Transaction removeAttachment(Attachment attachment) {
        this.attachments.remove(attachment);
        attachment.setTransaction(null);
        return this;
    }

    public void setAttachments(Set<Attachment> attachments) {
        if (this.attachments != null) {
            this.attachments.forEach(i -> i.setTransaction(null));
        }
        if (attachments != null) {
            attachments.forEach(i -> i.setTransaction(this));
        }
        this.attachments = attachments;
    }

    public Wallet getWallet() {
        return this.wallet;
    }

    public Transaction wallet(Wallet wallet) {
        this.setWallet(wallet);
        return this;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public Currency getCurrency() {
        return this.currency;
    }

    public Transaction currency(Currency currency) {
        this.setCurrency(currency);
        return this;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public Category getCategory() {
        return this.category;
    }

    public Transaction category(Category category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaction)) {
            return false;
        }
        return id != null && id.equals(((Transaction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transaction{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", amount=" + getAmount() +
            ", type='" + getType() + "'" +
            ", periodic='" + getPeriodic() + "'" +
            "}";
    }
}
