

public class Driver {
    
    public static void main(String[] args) {
        System.out.println("=== Testing User Class ===");
        
        // Test User constructor
        User user1 = new User(1, "Alice", "password123");
        User user2 = new User(2, "Bob", "pass456");
        
        System.out.println("User 1: " + user1.getUserName() + " (ID: " + user1.getUserID() + ")");
        System.out.println("User 2: " + user2.getUserName() + " (ID: " + user2.getUserID() + ")");
        
        System.out.println("\n=== Testing Request Class ===");
        
        // Test Request constructor and getters with new parameters
        Request req1 = new Request(user1, "Fix my fence", 2, "Downtown", "Fence Repair", "Email", "Home Repair");
        Request req2 = new Request(user1, "Paint house", 3, "Uptown", "House Painting", "Phone", "Home Improvement");
        Request req3 = new Request(user2, "Repair car", 4, "Downtown", "Car Repair", "SMS", "Auto");
        Request req4 = new Request(user2, "Garden cleanup", 2, "Suburbs", "Garden Work", "Email", "Outdoor");
        
        System.out.println("Request 1: " + req1.getRequestDescription() + 
                         " (Title: " + req1.getTitle() +
                         ", Difficulty: " + req1.getRequestDifficulty() + 
                         ", Location: " + req1.getLocation() +
                         ", Category: " + req1.getCategory() +
                         ", Contact: " + req1.getContactPreference() +
                         ", ID: " + req1.getRequestId() + ")");
        System.out.println("Request 2: " + req2.getRequestDescription() + 
                         " (Title: " + req2.getTitle() +
                         ", Difficulty: " + req2.getRequestDifficulty() + 
                         ", Location: " + req2.getLocation() +
                         ", Category: " + req2.getCategory() + ")");
        System.out.println("Request 3: " + req3.getRequestDescription() + 
                         " (Title: " + req3.getTitle() +
                         ", Category: " + req3.getCategory() + ")");
        System.out.println("Request 4: " + req4.getRequestDescription() + 
                         " (Title: " + req4.getTitle() +
                         ", Contact: " + req4.getContactPreference() + ")");
        
        System.out.println("\n=== Testing Requests Collection (Static) ===");
        
        // Test adding requests to Requests collection
        Requests.addIncompleteRequest(req1);
        Requests.addIncompleteRequest(req2);
        Requests.addIncompleteRequest(req3);
        Requests.addIncompleteRequest(req4);
        
        System.out.println("Incomplete count: " + Requests.getIncompleteCount());
        System.out.println("Complete count: " + Requests.getCompleteCount());
        
        // Display all incomplete requests
        System.out.println("\n--- Display Incomplete Requests ---");
        Requests.displayIncompleteRequests();
        
        System.out.println("\n=== Testing Filter Methods ===");
        
        // Test getRequestsByDifficulty
        System.out.println("\n--- Requests with Difficulty 2 ---");
        Request[] diff2 = Requests.getRequestsByDifficulty(2);
        for (Request r : diff2) {
            System.out.println("  " + r.getRequestDescription() + " - Difficulty: " + r.getRequestDifficulty());
        }
        
        // Test getIncompleteRequestsByDifficulty
        System.out.println("\n--- Incomplete Requests with Difficulty 3 ---");
        Request[] incompDiff3 = Requests.getIncompleteRequestsByDifficulty(3);
        for (Request r : incompDiff3) {
            System.out.println("  " + r.getRequestDescription());
        }
        
        // Test getRequestsByLocation
        System.out.println("\n--- Requests at 'Downtown' ---");
        Request[] downtown = Requests.getRequestsByLocation("Downtown");
        for (Request r : downtown) {
            System.out.println("  " + r.getRequestDescription() + " - Location: " + r.getLocation());
        }
        
        // Test getIncompleteRequestsByLocation
        System.out.println("\n--- Incomplete Requests at 'Uptown' ---");
        Request[] uptownInc = Requests.getIncompleteRequestsByLocation("Uptown");
        for (Request r : uptownInc) {
            System.out.println("  " + r.getRequestDescription());
        }
        
        // Test getRequestsByRequester
        System.out.println("\n--- Requests from " + user1.getUserName() + " ---");
        Request[] user1Reqs = Requests.getRequestsByRequester(user1);
        for (Request r : user1Reqs) {
            System.out.println("  " + r.getRequestDescription() + " (Requester: " + r.getRequester().getUserName() + ")");
        }
        
        // Test getIncompleteRequestsByRequester
        System.out.println("\n--- Incomplete Requests from " + user2.getUserName() + " ---");
        Request[] user2ReqsInc = Requests.getIncompleteRequestsByRequester(user2);
        for (Request r : user2ReqsInc) {
            System.out.println("  " + r.getRequestDescription());
        }
        
        System.out.println("\n=== Testing Completed Request Management ===");
        
        // Mark some requests as completed
        System.out.println("\nMarking req1 as completed...");
        req1.setCompleted(true);
        
        System.out.println("Marking req3 as completed...");
        req3.setCompleted(true);
        
        // Trigger update
        System.out.println("\nCalling updateRequests()...");
        Requests.updateRequests(null);
        
        System.out.println("Incomplete count: " + Requests.getIncompleteCount());
        System.out.println("Complete count: " + Requests.getCompleteCount());
        
        System.out.println("\n--- Display All Incomplete Requests ---");
        Requests.displayIncompleteRequests();
        
        System.out.println("\n--- Display All Complete Requests ---");
        Requests.displayCompleteRequests();
        
        System.out.println("\n=== Testing Complete Request Filters ===");
        
        // Test getCompleteRequestsByDifficulty
        System.out.println("\n--- Complete Requests with Difficulty 2 ---");
        Request[] compDiff2 = Requests.getCompleteRequestsByDifficulty(2);
        for (Request r : compDiff2) {
            System.out.println("  " + r.getRequestDescription() + " - Completed: " + r.isCompleted());
        }
        
        // Test getCompleteRequestsByLocation
        System.out.println("\n--- Complete Requests at 'Downtown' ---");
        Request[] downComplete = Requests.getCompleteRequestsByLocation("Downtown");
        for (Request r : downComplete) {
            System.out.println("  " + r.getRequestDescription());
        }
        
        // Test getCompleteRequestsByRequester
        System.out.println("\n--- Complete Requests from " + user1.getUserName() + " ---");
        Request[] user1ReqsComp = Requests.getCompleteRequestsByRequester(user1);
        for (Request r : user1ReqsComp) {
            System.out.println("  " + r.getRequestDescription());
        }

        System.out.println("\n=== Testing New Filter Methods (Title, Category, Contact) ===");

        // Test getRequestsByTitle
        System.out.println("\n--- Requests with Title 'Fence Repair' ---");
        Request[] fenceTitle = Requests.getRequestsByTitle("Fence Repair");
        for (Request r : fenceTitle) {
            System.out.println("  " + r.getRequestDescription() + " - Title: " + r.getTitle());
        }

        // Test getIncompleteRequestsByTitle
        System.out.println("\n--- Incomplete Requests with Title 'House Painting' ---");
        Request[] paintTitle = Requests.getIncompleteRequestsByTitle("House Painting");
        for (Request r : paintTitle) {
            System.out.println("  " + r.getRequestDescription());
        }

        // Test getRequestsByCategory
        System.out.println("\n--- Requests in 'Home Improvement' Category ---");
        Request[] homeImpCat = Requests.getRequestsByCategory("Home Improvement");
        for (Request r : homeImpCat) {
            System.out.println("  " + r.getRequestDescription() + " - Category: " + r.getCategory());
        }

        // Test getIncompleteRequestsByCategory
        System.out.println("\n--- Incomplete Requests in 'Outdoor' Category ---");
        Request[] outdoorCat = Requests.getIncompleteRequestsByCategory("Outdoor");
        for (Request r : outdoorCat) {
            System.out.println("  " + r.getRequestDescription());
        }

        // Test getRequestsByContactPreference
        System.out.println("\n--- Requests with Contact Preference 'Email' ---");
        Request[] emailContact = Requests.getRequestsByContactPreference("Email");
        for (Request r : emailContact) {
            System.out.println("  " + r.getRequestDescription() + " - Contact: " + r.getContactPreference());
        }

        // Test getIncompleteRequestsByContactPreference
        System.out.println("\n--- Incomplete Requests with Contact Preference 'Phone' ---");
        Request[] phoneContact = Requests.getIncompleteRequestsByContactPreference("Phone");
        for (Request r : phoneContact) {
            System.out.println("  " + r.getRequestDescription());
        }
        
        System.out.println("\n=== Testing User Request Methods ===");
        
        System.out.println("User 1 requests made: " + user1.getRequestsMade());
        user1.incrementRequestsMade();
        System.out.println("After increment: " + user1.getRequestsMade());
        
        System.out.println("User 1 requests helped: " + user1.getRequestsHelped());
        user1.incrementRequestsHelped();
        System.out.println("After increment: " + user1.getRequestsHelped());
        
        System.out.println("\n=== Testing Request Completion Status ===");
        
        System.out.println("req1 completed: " + req1.isCompleted());
        System.out.println("req2 completed: " + req2.isCompleted());
        System.out.println("req4 completed: " + req4.isCompleted());
        
        System.out.println("\n=== All Tests Complete ===");
    }
}
