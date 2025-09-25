package com.kushg.SweetShopApplication.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sweets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sweet {

    @Id
    private String id;

    private String name;
    private String category;
    private double price;
    private int quantity;   // stock in shop
    private String imageUrl; // Cloudinary image link
}